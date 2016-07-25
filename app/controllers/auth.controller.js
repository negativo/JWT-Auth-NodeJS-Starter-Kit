var config = require('../config/config');

module.exports = function(User){

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
		authenticate:function(req, res) {
			var { name, password } = req.body;
			if(!name || !name.length ) {
				return res.status(400).json({
					success: false,
					message: 'No username provided'
				})
			};
			User.findOne({
				name: name
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
						return res.json(token);
					});

				});

			});
		},

	}; //return

};
