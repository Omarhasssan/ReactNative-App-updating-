Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(){var state=arguments.length>0&&arguments[0]!==undefined?arguments[0]:socket;var action=arguments[1];switch(action.type){case'CREATE_ROOM_BY_USER_ID':{console.log('CREATE_ROOM_BY_USER_ID');socket=_socket2.default.connect('http://f3ed49af.ngrok.io');socket.emit('roomByUserId',{id:action.id});return socket;}case'CREATE_ROOM_BY_TEAM_ID':{console.log('CREATE_ROOM_BY_TEAM_ID');socket.emit('roomByTeamId',{id:action.id});return socket;}case'CREATE_ROOM_BY_ROOM_ID':{console.log('CREATE_ROOM_BY_ROOM_ID');socket.emit('roomByRoomId',{id:action.id});return socket;}case'JOIN_ROOMS_CHANNEL':{console.log('JOINED ROOMS CHANNEL');socket=socket.emit('joinRoomsChannel');return socket;}default:{return state;}}};var _socket=require('socket.io-client/dist/socket.io');var _socket2=_interopRequireDefault(_socket);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var socket=null;