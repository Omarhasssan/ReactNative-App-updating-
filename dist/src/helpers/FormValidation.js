Object.defineProperty(exports,"__esModule",{value:true});exports.validateSignUpForm=validateSignUpForm;var _helpers=require('../helpers');function validateSignUpForm(user){var name=user.name,password=user.password,mobilenumber=user.mobilenumber;return new Promise(function(resolve,reject){return _helpers.DBHelpers.findByName(name).then(function(){return reject('user exists before');}).catch(function(){if(password.length<2)return reject('password should be at least 4 digits digits');if(mobilenumber.length<2||isNaN(mobilenumber)){return reject('mobile number should be 12 digits');}return resolve('valid');});});}