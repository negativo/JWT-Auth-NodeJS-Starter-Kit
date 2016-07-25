var config = require('../config/config');
var jwt = require('jsonwebtoken');

module.exports = function (role) {
  if (role && role === 'admin') {
    return function (req,res,next) {
      var token = req.body.token || req.query.token || req.header('Authorization') || req.header('x-access-token');
      if(!token){
        return res.status(403).json({
          success: false,
          message: 'No token provided'
        });
      }

      try {
        var decoded = jwt.verify(token, config.secret );
      } catch(err) {
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token'
        });
      }

      req.user = decoded;

      if(req.user && req.user.admin) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          status: 403,
          message: 'Unauthorized.'
        });
      }
    }
  } else {
    return function (req,res,next) {
      var token = req.body.token || req.query.token || req.header('Authorization') || req.header('x-access-token');
      if(!token){
        return res.status(403).json({
          success: false,
          message: 'No token provided'
        });
      }

      try {
        var decoded = jwt.verify(token, config.secret );
      } catch(err) {
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token'
        });
      }
      req.user = decoded;
      if(decoded) next();
    }
  }
}
