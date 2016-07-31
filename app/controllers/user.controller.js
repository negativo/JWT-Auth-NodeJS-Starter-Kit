module.exports = function(User){

	return {

		getAll: function(req, res) {
			User.find({}, function(err, users) {
				if(!err) { 

					res.json({data:users}); 

				}else{

				}
			});
		},

		view: function(req, res){

			res.sendStatus(200);

		},

		update: function(req, res){

			res.sendStatus(200);

		},

		delete: function(req, res){

			res.sendStatus(200);

		},

		create: function(req, res){

			res.sendStatus(200);

		}


	};

};
