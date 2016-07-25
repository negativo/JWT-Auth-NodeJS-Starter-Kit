module.exports = function(User,jwt){

	return {

		authenticate:function(req, res) {
			console.log(req.body);
			User.findOne({
				name: req.body.name
			}, function(err, user) {

				if (err) throw err;

				if (!user) {
					res.json({ success: false, message: 'Authentication failed. User not found.' });
				} else if (user) {

					if (user.password != req.body.password) {
						res.json({ success: false, message: 'Authentication failed. Wrong password.' });
					} else {

						var token = jwt.sign(user, app.get('superSecret'), {
							expiresIn: 86400 // expires in 24 hours
						});

						res.json({
							success: true,
							message: 'Enjoy your token!',
							token: token
						});
					}

				}

			});
		},
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
		}
	};

};
