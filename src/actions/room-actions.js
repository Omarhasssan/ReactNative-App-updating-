import { convertDateToYMDH } from '../helpers';
import {
  saveAndSendObservingRequest,
  setTeamMatch,
  removeObservingRequest,
  updateUserRoom,
} from '.';
import firebase from '../config/firebase';
import { usersService, roomsService, teamsService } from '../Service';
import { matchesService } from '../../functions/dist/server/Service/matchesService';

export const createRoom = (user, Name, socket) => dispatch => {
  // save room to database admin of el room and room details

  const room = {};
  room.teamOwner = user.teamId;
  room.name = Name;
  room.settings = { OwnerReady: false, GuestReady: false };
  roomsService.addRoom(room);
  // console.log('usr', user);
  teamsService.getTeamById(user.teamId).then(team => {
    const Room = { ...room, teamOwner: team };
    dispatch({
      type: 'CREATE_ROOM_BY_ROOM_ID',
      id: Room.id,
    });
    dispatch({
      type: 'ADD_ROOM',
      room: Room,
    });
    dispatch(updateUserRoom(user, Room));
    socket.emit('addRoom', { addedRoom: Room });
  });
};
export const getRooms = () => dispatch => {
  return roomsService.getRooms().then(rooms => {
    dispatch({ type: 'ROOMS', rooms });
    Promise.resolve();
  });
};

export const updateRoomDB = (route, value) => {
  roomsService.updateRoom(route, value);
};
export const setJoinedRoom = room => dispatch => {
  dispatch({
    type: 'SET_JOINED_ROOM',
    room,
  });
};

export const updateRoom = (room, type, value, socket) => dispatch => {
  const updatedRoom = { ...room, [type]: value };
  socket.emit('roomUpdated', { updatedRoom });
};
export const joinRoom = (room, team, socket) => dispatch => {
  // join roomSocket
  dispatch({
    type: 'CREATE_ROOM_BY_ROOM_ID',
    id: room.id,
  });
  // update in DB
  updateRoomDB(`Rooms/${room.id}/joinedTeam`, team.id);
  // update allRooms and room object in roomOwner and roomGuest
  dispatch(updateRoom(room, 'joinedTeam', team, socket));
};
export const listenToRoomChanges = (user, socket) => dispatch => {
  dispatch({
    type: 'JOIN_ROOMS_CHANNEL',
  });
  // update ROOMS object
  socket.on('updateRooms', updatedRoom => {
    dispatch({
      type: 'UPDATE_ROOMS',
      room: { id: updatedRoom.id, updatedRoom },
    });
  });
  socket.on('roomAdded', addedRoom => {
    // IF THIS IS NOT THE USER THAT ADD  THIS ROOM THEN UPDATE HIS REDUCER
    if (addedRoom.id !== user.roomId) {
      dispatch({
        type: 'ADD_ROOM',
        room: addedRoom,
      });
    }
  });

  socket.on('updateRoom', updatedRoom => {
    // if the user is roomOwner
    console.log('in update Room Socet');
    if (updatedRoom.id === user.roomId) {
      console.log('update mycreatdRoom');
      dispatch({
        type: 'UPDATE_CREATED_ROOM',
        room: { id: updatedRoom.id, updatedRoom },
      });
    }
    // if guest
    else {
      console.log('update myjoinedRoom');

      dispatch({
        type: 'UPDATE_JOINED_ROOM',
        room: { id: updatedRoom.id, updatedRoom },
      });
    }
  });
  let first = true;
  firebase
    .database()
    .ref('Rooms')
    .on('child_added', room => {
      room = room.toJSON();
      firebase
        .database()
        .ref(`${'Rooms'}/${room.id}/${'settings'}/${'observer'}/${'status'}`)
        .on('value', async status => {
          // should return req status and roomId
          if (first) first = false;
          else {
            const updatedRoom = await roomsService.getRoomById(room.id);
            dispatch(
              updateRoom(updatedRoom, 'settings', updatedRoom.settings, socket)
            );
            first = false;
          }
        });
    });
  // DBHelpers.onRoomObserverStatusChanged().then((updatedRoom) => {
  //   dispatch(updateRoom(updatedRoom, 'settings', updatedRoom.settings, socket));
  // });
};

export const setRoomDate = (room, date, socket) => dispatch => {
  updateRoomDB(`Rooms/${room.id}/settings/date`, date);
  dispatch(updateRoom(room, 'settings', { ...room.settings, date }, socket));
};
export const setRoomLocation = (room, location, socket) => dispatch => {
  updateRoomDB(`Rooms/${room.id}/settings/location/address`, location.address);
  updateRoomDB(
    `Rooms/${room.id}/settings/location/latitude`,
    location.latitude
  );
  updateRoomDB(
    `Rooms/${room.id}/settings/location/longitude`,
    location.longitude
  );
  dispatch(
    updateRoom(room, 'settings', { ...room.settings, location }, socket)
  );
};
export const leaveRoom = (room, socket) => dispatch => {
  updateRoomDB(`Rooms/${room.id}/joinedTeam`, null);
  dispatch(updateRoom(room, 'joinedTeam', null, socket));
  socket.emit('leaveRoom', { roomId: room.id });
};

export const setRoomObserver = (room, observerId, socket) => dispatch => {
  // updateRoom in DB AND REDUCER w bt send request lel observer
  if (observerId) {
    updateRoomDB(`Rooms/${room.id}/settings/observer/id`, observerId);
    updateRoomDB(`Rooms/${room.id}/settings/observer/status`, 'PENDING');
    // law kan f observer abl kda w hasl change -> this.observer != el observer l fat
    if (
      room.settings &&
      room.settings.observer &&
      room.settings.observer.info.id != observerId
    ) {
      // then remove request l observer l fat mn l database
      // given el roomId wl observerId u can remove it from reducer and database
      // because i dnt have requestId
      dispatch(
        removeObservingRequest(room.id, room.settings.observer.info.id, socket)
      );
    }
    dispatch(saveAndSendObservingRequest(room, observerId, socket));
    usersService.getUserById(observerId).then(user => {
      dispatch(
        updateRoom(
          room,
          'settings',
          {
            ...room.settings,
            observer: { info: { ...user }, status: 'PENDING' },
          },
          socket
        )
      );
    });
  } else {
    dispatch(
      removeObservingRequest(room.id, room.settings.observer.info.id, socket)
    );
    updateRoomDB(`Rooms/${room.id}/settings/observer`, null);
    dispatch(
      updateRoom(room, 'settings', { ...room.settings, observer: {} }, socket)
    );
  }
};
export const setOwnerReady = (room, val, socket) => dispatch => {
  dispatch(
    updateRoom(room, 'settings', { ...room.settings, OwnerReady: val }, socket)
  );
};
export const setGuestReady = (room, val, socket) => dispatch => {
  dispatch(
    updateRoom(room, 'settings', { ...room.settings, GuestReady: val }, socket)
  );
};
export const setRoomMatch = (room, socket) => dispatch => {
  const dateObj = convertDateToYMDH(room.settings.date);
  const matchSettings = { ...room.settings };
  const homeTeamMatch = {
    oponnentTeam: room.joinedTeam,
    date: dateObj,
    ...matchSettings.settings,
  };
  const awayTeamMatch = {
    oponnentTeam: room.teamOwner,
    date: dateObj,
    ...matchSettings.settings,
  };
  const matchDB = {
    homeTeam: room.teamOwner.id,
    awayTeam: room.joinedTeam.id,
    date: dateObj,
    location: room.settings.location,
    observer: room.settings.observer.info.id,
  };
  matchesService.addMatch(matchDB).then(matchId => {
    homeTeamMatch.id = matchId;
    awayTeamMatch.id = matchId;
    dispatch(setTeamMatch(homeTeamMatch, room.teamOwner, socket));
    dispatch(setTeamMatch(awayTeamMatch, room.joinedTeam, socket));
  });
};
