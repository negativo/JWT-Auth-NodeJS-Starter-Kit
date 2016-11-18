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
            User.update({"_id":req.params.id}, req.body.user ,function(err, user) {
                if(!err) {


                    res.json({data:user});
                }else{
                    res.json({error:err});
                }
            });

        },

        delete: function(req, res){
            if(req.user._id === req.params.id){

                User.find({"_id":req.params.id}, function(err, user) {

                    if(!err) {

                        if(!user){

                            res.json({
                                error:{
                                    type:'DBException',
                                    message:'no user found'
                                }
                            });

                        }else{

                            res.json({data:"User deleted successfully"});
                        }
                    }else{

                        res.json({error:err});

                    }
                });
                res.sendStatus(200);

            }
        },

        create: function(req, res){

            var new_user = new User();

            new_user.username = req.body.user.username;
            new_user.password = req.body.user.password;
            new_user.email = req.body.user.email;
            new_user.admin = false;

            new_user.save(function(err,saved){

                if(!err){

                    res.send({data:"New User Created"});

                }else{

                    res.send({
                        error:{
                            type:"DBException",
                            message:err
                        }
                    });
                }
            });

        }


    };

};
