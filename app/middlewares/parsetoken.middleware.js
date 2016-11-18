var config = require('../config/config');
var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  var token = req.body.token || req.query.token || req.header('Authorization');
  if(token){
    try {
      jwt.verify(token, config.secret,function(err, decoded){
        var dec = jwt.decode(token, {complete: true});
        req.user = dec;

      });
    } catch(err) {
      console.log(err);
    }
  }
  next();
};
