Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _redux=require('redux');var _reducers=require('../reducers');var _reducers2=_interopRequireDefault(_reducers);var _reduxThunk=require('redux-thunk');var _reduxThunk2=_interopRequireDefault(_reduxThunk);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var configureStore=function configureStore(){return _extends({},(0,_redux.createStore)(_reducers2.default,(0,_redux.applyMiddleware)(_reduxThunk2.default)));};exports.default=configureStore;