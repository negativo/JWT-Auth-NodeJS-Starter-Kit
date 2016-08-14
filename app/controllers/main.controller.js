module.exports = function(User){

	return {

		setup:function(req, res) {
			var nick = new User({
				email: process.env.EMAIL,
				username: process.env.USERNAME,
				password: process.env.PASSWORD,
				admin: true
			});
			nick.save(function(err) {
				if (err) throw err;
				console.log('User saved successfully');
				return res.json({ success: true, user:nick });
			});
		},
		index: function(req, res) {
			return res.send('API  http://localhost:'+ process.env.PORT +'/api');
		},
		apiIndex:function(req, res) {
			return res.json({ message: 'BetterMarks API' });
		},
		check:function(req, res) {
			return res.json({
				success:true,
				user: req.user,
				message: 'Normal user accesible route'
			});
		},
		adminCheck:function(req, res) {
			return res.json({
				success:true,
				user: req.user,
				message: 'Admin user accesible route'
			});
		}
	};

};
