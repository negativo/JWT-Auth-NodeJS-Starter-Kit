module.exports = function(User){

	return {

		setup:function(req, res) {

			var nick = new User({ 
				email: 'davidebrr@gmail.com',
				name: 'davide', 
				password: 'password',
				admin: true 
			});
			nick.save(function(err) {
				if (err) throw err;

				console.log('User saved successfully');
				res.json({ success: true });
			});
		},
		index: function(req, res) {
			res.send('API  http://localhost:'+port+'/api');
		},
		apiIndex:function(req, res) {
			res.json({ message: 'BetterMarks API' });
		},
		check:function(req, res) {
			res.json(req.decoded);
		}
	};

};
