Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/containers/TabNavigator.js';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);var _reactRedux=require('react-redux');var _reactNavigation=require('react-navigation');var _CreateRoom=require('./CreateRoom');var _CreateRoom2=_interopRequireDefault(_CreateRoom);var _Rooms=require('./Rooms');var _Rooms2=_interopRequireDefault(_Rooms);var _withCheckUserHaveRoom=require('../hocs/withCheckUserHaveRoom');var _withCheckUserHaveRoom2=_interopRequireDefault(_withCheckUserHaveRoom);var _actions=require('../actions');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var Tabs=(0,_reactNavigation.TabNavigator)({createdRoom:{screen:(0,_withCheckUserHaveRoom2.default)(_CreateRoom2.default)},JoinRoom:{screen:_Rooms2.default}});var TabNav=function(_Component){_inherits(TabNav,_Component);function TabNav(){_classCallCheck(this,TabNav);return _possibleConstructorReturn(this,(TabNav.__proto__||Object.getPrototypeOf(TabNav)).apply(this,arguments));}_createClass(TabNav,[{key:'componentDidMount',value:function componentDidMount(){var _props=this.props,listenToRoomChanges=_props.listenToRoomChanges,user=_props.user,socket=_props.socket;}},{key:'render',value:function render(){return _react2.default.createElement(Tabs,{screenProps:this.props,__source:{fileName:_jsxFileName,lineNumber:21}});}}]);return TabNav;}(_react.Component);var mapStateToProps=function mapStateToProps(_ref){var roomsReducer=_ref.roomsReducer,auth=_ref.auth,socket=_ref.socket,teamsReducer=_ref.teamsReducer;return{rooms:roomsReducer.rooms,room:roomsReducer.createdRoom,user:auth.user,team:teamsReducer.curntTeam,socket:socket,teamsReducer:teamsReducer};};var mapDispatchToProps=function mapDispatchToProps(dispatch){return{joinRoom:function joinRoom(room,user,socket){dispatch((0,_actions.setJoinedRoom)(room));dispatch((0,_actions.joinRoom)(room,user,socket));},listenToRoomChanges:function listenToRoomChanges(user,socket){dispatch((0,_actions.listenToRoomChanges)(user,socket));}};};exports.default=(0,_reactRedux.connect)(mapStateToProps,mapDispatchToProps)(TabNav);