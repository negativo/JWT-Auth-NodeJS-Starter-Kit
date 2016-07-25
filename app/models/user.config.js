var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
	name: { type:String, require:true },
	password: { type:String, require:true },
	admin: { type:Boolean, default: false }
});

UserSchema.pre('save', function (next) {
  var user = this;
  if(user.isModified('password')){
    user.password = bcrypt.hashSync(user.password);
  }
  next();
});

UserSchema.methods.checkPassword = function (hash, done) {
  var {username, password} = this;
  bcrypt.compare(hash, password, function (err, res) {
    if(res) return done(null, true );
    return done({message:'Wrong Password!', status: 401 });
  });
}

// UserSchema.methods.auth = function (done) {
//   var usr = this;
//   var token = jwt.sign({
//     _id: usr._id,
//     username: usr.username,
//     admin: usr.admin
//   }, secrets.app_key, {expiresIn: 1440 });
//   done(null, {
//     expire: Date.now() + 1440,
//     message: 'Authorization token',
//     token: token
//   });
// }


module.exports = mongoose.model('User', UserSchema, 'users');
