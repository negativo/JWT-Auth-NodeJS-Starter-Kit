const { Promise } = global
const mongoose = require('../config/database')
const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets')
const bcrypt = require('bcrypt-nodejs')
const validator = require('validator')

const UserSchema = mongoose.Schema({
  oid: { type: Number },
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Insert a valid valid email.',
    },
    required: [true, 'Email is required!'],
    unique: true,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: [true, 'Password is required.'] },
  created: { type: Date, default: Date.now() },
  admin: { type: Boolean, default: false },
})


UserSchema.pre('save', function userPreSave(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password)
  }
  next()
})

UserSchema.statics.userExist = function userExist(field, check) {
  let query = {}
  if (field === 'username') query = { username: check }
  if (field === 'email') query = { email: check }
  if (!field) return Promise.reject('No Data Provided')
  return this.findOne(query)
}

UserSchema.methods.checkPassword = function checkPassword(hash) {
  const { password } = this
  return new Promise((resolve, reject) => {
    bcrypt.compare(hash, password, (passwordError, res) => {
      if (res) return resolve({ success: true })
      return reject({ message: 'Wrong Password!', status: 401 })
    })
  })
}

UserSchema.methods.auth = function auth() {
  return new Promise((resolve) => {
    const usr = this.toJSON()
    delete usr.password
    const token = jwt.sign(usr, secrets.APP_KEY)
    return resolve({
      message: 'Authorization token',
      success: true,
      token,
    })
  })
}


module.exports = mongoose.model('user', UserSchema, 'users')
