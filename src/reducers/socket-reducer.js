import io from 'socket.io-client/dist/socket.io';

let socket = null;
export default function (state = socket, action) {
  switch (action.type) {
    case 'CREATE_ROOM_BY_USER_ID': {
      console.log('CREATE_ROOM_BY_USER_ID');

      socket = io.connect('http://8230d262.ngrok.io');
      socket.emit('roomByUserId', { id: action.id });
      return socket;
    }
    // case 'JOIN_ROOM_BY_ROOM_ID': {
    //   console.log('CREATE_ROOM_BY_ROOM_ID');
    //   socket = socket.emit('roomByRoomId', { id: action.id });
    //   return socket;
    // }
    case 'JOIN_ROOMS_CHANNEL': {
      console.log('JOINED ROOMS CHANNEL');
      socket = socket.emit('joinRoomsChannel');
      return socket;
    }

    default: {
      return state;
    }
  }
}
