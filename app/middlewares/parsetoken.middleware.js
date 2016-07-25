var config = require('../config/config');
var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  var token = req.body.token || req.query.token || req.header('Authorization');
  if(token){
    try {
      req.user = jwt.verify(token, secrets.app_key);
    } catch(err) { /**/ }
  }
  next();
}
