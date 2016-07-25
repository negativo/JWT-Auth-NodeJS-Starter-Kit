module.exports = function(User){

	return {

		getAll: function(req, res) {
			User.find({}, function(err, users) {
				res.json(users);
			});
		},


	};

};
