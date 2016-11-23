const secrets = require('../config/secrets')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

module.exports = (restriction) => {
  return (req, res, next) => {
    let decoded
    const token = req.body.token || req.query.token || req.header('Authorization')

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided',
      })
    }

    try {
      decoded = jwt.verify(token, secrets.APP_KEY)
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: 'Failed to authenticate token',
      })
    }

    if (!decoded) {
      return res.status(403).json({
        success: false,
        status: 401,
        message: 'Unauthorized.',
      })
    }

    return User
      .findOne({ _id: decoded._id })
      .then((user) => {
        if (!user) {
          return Promise.reject({
            success: false,
            message: 'Unauthroized: No user found for this access token',
            status: 401,
          })
        }
        return user
      })
      // Check route restrictions
      .then((user) => {
        req.user = user

        // Admin Only routes
        if (!req.user.admin && restriction && restriction === 'admin') {
          return Promise.reject({
            status: 401,
            message: 'Unauthorized to access this resource.',
          })
        }
        // If user is admin or route have no restriction, do whatever you want
        return next()
      })
      .catch((err) => {
        return res.status(err.status ? err.status : 500).json({
          success: false,
          status: err.status ? err.status : 500,
          message: err.message ? err.message : 'Some error occured with your accesso token, login again.',
        })
      })
  }
}
