var config = require('../config/config');
var jwt = require('jsonwebtoken');

module.exports = function(app,User){


  function TransformUser(user){

    var newUser = {
      _id: user._id,
      email: user.email,
      username: user.username
    };

    return newUser;
  }


  return {

    checkToken:function(req, res, next) {

      var token = req.body.token || req.param('token') || req.headers['x-access-token'];

      if (token) {

        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
          } else {
            req.decoded = decoded;	
            next();
          }
        });

      } else {

        return res.status(403).send({ 
          success: false, 
          message: 'No token provided.'
        });

      }
    },
 
    register: function(req, res){

      var new_user = new User();

      new_user.username = req.body.user.username;
      new_user.password = req.body.user.password;
      new_user.email = req.body.user.email;
      new_user.admin = false;

      new_user.save(function(err,saved){

        if(!err){

          res.send({data:{success:true,message:"New User Created"}});

        }else{

          res.send({
            error:{
              type:"DBException",
              message:err
            }
          });
        }
      });

    },
    
    authenticate:function(req, res) {
      var { username, password } = req.body;
      if(!username || !username.length ) {
        return res.status(400).json({
          success: false,
          message: 'No username provided'
        })
      };
      User.findOne({
        username: username
      }, function(err, user) {
        if (err) {
          return res.status(500).json({
            success: false,
            err
          });
        };

        if (!user) {
          return res.json({
            success: false,
            message: 'Authentication failed. User not found.'
          });
        };

        user.checkPassword( password, function (err, check) {
          if(err) return res.status(403).json({
            success: false,
            message: err
          });

          user.auth(function (err, token) {

            token.user = TransformUser(user);
            token.success = true;
            console.log('auth token: ',token);
            req.user = token.user;
            return res.json(token);
          });

        });

      });
    },

  }; //return

};
