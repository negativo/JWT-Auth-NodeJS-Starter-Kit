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

			User.find({"_id":req.params.id}, function(err, user) {
				if(!err) {

					if(!user){
						res.json({error:'no user found'});
					}else{

						res.json({data:user});
					}
				}else{
					res.json({error:err});
				}
			});

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
