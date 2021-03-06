/*eslint-disable */
require('babel-polyfill');
const roomsService = require('./dist/server/Service').roomsService;
const usersService = require('./dist/server/Service').usersService;
const teamsService = require('./dist/server/Service').teamsService;
const requestsService = require('./dist/server/Service').requestsService;
const notificationsService = require('./dist/server/Service')
  .notificationsService;
const observingMatchesService = require('./dist/server/Service')
  .observingMatchesService;
const handleNotificationRoute = require('./dist/server/helpers')
  .handleNotificationRoute;
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const config = functions.config();

admin.initializeApp(config.firebase);
var express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(5000);

function updateTeamRecordDB(teamId, records) {
  teamsService.updateTeam(`teams/${teamId}/records`, records);
}

app.post('/sendNotification', (req, res) => {
  const { usersId, teamId, updatedNotifications } = req.body || {};
  if (teamId) {
    notificationsService.updateNotifications(
      `Notifications/${teamId}`,
      updatedNotifications
    );
  }
  if (usersId)
    usersId.map(userId =>
      notificationsService.updateNotifications(
        `Notifications/${userId}`,
        updatedNotifications
      )
    );
  res.send(200);
});

app.post('/submitMatchObservation', (req, res) => {
  /*
  * forevery player in two teams update his goals in db and increment gamesPlayed BY one
  * update team win,lose,draw,gamePlayed,numOfGoals *both teams*
  * delete from matchesToObserve
  */
  const matchDetails = req.body;
  const { firstTeam } = matchDetails;
  // = {goals:,playersGoals:{0:{id:gfgf,goals:5},1:{id:gfgf,goals:5}}}
  const { secondTeam } = matchDetails;
  // combine both team players in one array to iterate over them
  let allPlayers = [];
  allPlayers.push(...Object.values(firstTeam.playersGoals));
  allPlayers.push(...Object.values(secondTeam.playersGoals));
  allPlayers.map(playerDetails => {
    return usersService.getUserById(playerDetails.id).then(player => {
      const playerGoals =
        parseInt(player.records.goals) + parseInt(playerDetails.goals);

      const playerGamesPlayed = parseInt(player.records.gamesPlayed) + 1;
      const playerRecords = {
        goals: playerGoals,
        gamesPlayed: playerGamesPlayed,
      };
      usersService.updateUser(
        `users/${playerDetails.id}/records`,
        playerRecords
      );
    });
  });
  // for teams
  let fTeam, fTeamGoals, fTeamGamesPlayed, firstTeamRecords;
  teamsService
    .getTeamById(firstTeam.id)
    .then(team => {
      fTeam = team;
      fTeamGoals = parseInt(fTeam.records.goals) + parseInt(firstTeam.goals);
      fTeamGamesPlayed = fTeam.records.gamesPlayed + 1;
      firstTeamRecords = {};
      Object.assign(firstTeamRecords, fTeam.records);
      firstTeamRecords.goals = fTeamGoals;
      firstTeamRecords.gamesPlayed = fTeamGamesPlayed;
      return Promise.resolve();
    })
    .then(() => {
      teamsService.getTeamById(secondTeam.id).then(sTeam => {
        const sTeamGoals =
          parseInt(sTeam.records.goals) + parseInt(secondTeam.goals);

        const sTeamGamesPlayed = sTeam.records.gamesPlayed + 1;

        let secondTeamRecords = {};
        Object.assign(secondTeamRecords, sTeam.records);
        secondTeamRecords.goals = sTeamGoals;
        secondTeamRecords.gamesPlayed = sTeamGamesPlayed;
        if (firstTeam.goals > secondTeam.goals) {
          firstTeamRecords.wins = fTeam.records.wins + 1;
          secondTeamRecords.losses = sTeam.records.losses + 1;
          updateTeamRecordDB(firstTeam.id, firstTeamRecords);
          updateTeamRecordDB(secondTeam.id, secondTeamRecords);
        } else if (firstTeam.goals < secondTeam.goals) {
          firstTeamRecords.wins = fTeam.records.losses + 1;
          secondTeamRecords.wins = sTeam.records.wins + 1;
          updateTeamRecordDB(firstTeam.id, firstTeamRecords);
          updateTeamRecordDB(secondTeam.id, secondTeamRecords);
        } else {
          firstTeamRecords.wins = fTeam.records.draws + 1;
          secondTeamRecords.wins = sTeam.records.draws + 1;
          updateTeamRecordDB(firstTeam.id, firstTeamRecords);
          updateTeamRecordDB(secondTeam.id, secondTeamRecords);
        }
      });
    });
  res.send(200);
});
app.post('/acceptObservingRoom', (req, res) => {
  /*
  * change status in observing request table to accept giving requestId
  * update roomobserver status in room to accept giving roomId
  * update room Object
  */
  const request = req.body;
  const room = request.room;

  requestsService.updateRequest(request.id, 'observing');
  roomsService.updateRoom(
    `Rooms/${room.id}/settings/observer/status`,
    'ACCEPTED'
  );

  res.send(200);
});

exports.req = functions.https.onRequest(app);

/*
* trigger function for teamReqeusts table 'status'
* whenever status turned to 'accepted'
* 1- add this playerId to target team in teams table
* 2- add teamId to target user in users table
*/
exports.addUserToTeam = functions.database
  .ref('/TeamRequests/{reqId}/status')
  .onUpdate(event => {
    const db = admin.database();
    return event.before.ref.parent.once('value', req => {
      const playerId = req.val().playerId;
      const teamId = req.val().teamId;

      return db
        .ref(`${'teams'}/${teamId}/${'players'}`)
        .once('value', snapshot => {
          let players = snapshot.toJSON() || {};
          const sz = Object.keys(players).length;
          players[sz] = playerId;
          db.ref(`${'teams'}/${teamId}/${'players'}`).set(players);
          db.ref(`${'users'}/${playerId}/${'teamId'}`).set(teamId);
        });
    });
  });
// /*
// * trigger function for observerRequest
// * whenever status turned to 'accepted'
// * 1-update status to AC to his observing Room giving roomId
// *
// */
exports.onChangingObservingStatus = functions.database
  .ref('/ObservingRequests/{reqId}/status')
  .onUpdate(event => {
    // console.log('eBefore', event.before.val());
    // console.log('eafter', event.after.val());
    const roomId = event.after.val().roomId;

    const reqStatus = event.after.val().status;
    return admin
      .database()
      .ref(`${'Rooms'}/${roomId}/${'settings'}/${'observer'}/${'status'}`)
      .set(reqStatus);
  });

io.on('connection', socket => {
  console.log('connected');
  socket.on('disconnect', () => {
    console.log('dissssss');
  });

  socket.on('leaveRoom', data => {
    socket.leave(data.roomId, () => console.log('left the god damn room'));
  });
  // create room by useId to send and recieve requests
  socket.on('roomByUserId', data => {
    socket.join(data.id);
  });
  socket.on('roomByRoomId', data => {
    socket.join(data.id);
  });
  socket.on('roomByTeamId', data => {
    socket.join(data.id);
  });
  socket.on('setCurntRoom', data => {
    io.sockets.in(data.roomId).emit('getCurntRoom', data.roomId);
  });
  socket.on('sendRequest', data => {
    io.sockets.in(data.userId).emit('requests', data.request);
    //io.sockets.in(data.userId).emit('observingNotification');
  });
  socket.on('removeRequest', data => {
    io.sockets.in(data.userId).emit('removeRequest', data.request);
  });
  socket.on('joinRoomsChannel', () => {
    console.log('joinRommsChannel');
    socket.join('roomsChannel');
  });
  socket.on('roomUpdated', data => {
    console.log('in roomuPDATED++++++++++');
    // this for all joined in roomsChannel
    io.sockets.in('roomsChannel').emit('updateRooms', data.updatedRoom);
    // this is   for target room
    io.sockets.in(data.updatedRoom.id).emit('updateRoom', data.updatedRoom);
  });
  socket.on('addRoom', data => {
    io.sockets.in('roomsChannel').emit('roomAdded', data.addedRoom);
  });

  socket.on('teamHasMatch', data => {
    console.log('in socket server');
    io.sockets.in(data.teamId).emit('teamHasMatch', {
      teamId: data.teamId,
      updatedMatches: data.updatedMatches,
    });
  });

  // socket.on('sendNotification', data => {
  //   const { notificationType, userId } = data;
  //   io.sockets.in(userId).emit(notificationType);
  // });
});
