Object.defineProperty(exports,"__esModule",{value:true});var _redux=require('redux');var _authReducer=require('./auth-reducer');var _authReducer2=_interopRequireDefault(_authReducer);var _navReducer=require('./nav-reducer');var _navReducer2=_interopRequireDefault(_navReducer);var _globalReducer=require('./global-reducer');var _globalReducer2=_interopRequireDefault(_globalReducer);var _userRequestsReducer=require('./userRequests-reducer');var _userRequestsReducer2=_interopRequireDefault(_userRequestsReducer);var _teamReducer=require('./team-reducer');var _teamReducer2=_interopRequireDefault(_teamReducer);var _teamsReducer=require('./teams-reducer');var _teamsReducer2=_interopRequireDefault(_teamsReducer);var _socketReducer=require('./socket-reducer');var _socketReducer2=_interopRequireDefault(_socketReducer);var _roomsReducer=require('./rooms-reducer');var _roomsReducer2=_interopRequireDefault(_roomsReducer);var _ModelReducer=require('./Model-reducer');var _ModelReducer2=_interopRequireDefault(_ModelReducer);var _checkedItemsReducer=require('./checkedItems-reducer');var _checkedItemsReducer2=_interopRequireDefault(_checkedItemsReducer);var _observingMatchesReducer=require('./observingMatches-reducer');var _observingMatchesReducer2=_interopRequireDefault(_observingMatchesReducer);var _teamDetailsReducer=require('./teamDetails-reducer');var _teamDetailsReducer2=_interopRequireDefault(_teamDetailsReducer);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var rootReducer=(0,_redux.combineReducers)({auth:_authReducer2.default,nav:_navReducer2.default,players:_globalReducer2.default,userInvitations:_userRequestsReducer2.default,team:_teamReducer2.default,socket:_socketReducer2.default,teamsReducer:_teamsReducer2.default,roomsReducer:_roomsReducer2.default,model:_ModelReducer2.default,checkedItems:_checkedItemsReducer2.default,observingMatches:_observingMatchesReducer2.default,teamRecords:_teamDetailsReducer2.default});exports.default=rootReducer;