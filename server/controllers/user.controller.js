const User = require('../models/user.model')
const Setting = require('../models/setting.model')

module.exports = {
  index: (req, res) => {
    User.find({}, (err, users) => {
      if (err) return res.status(500).json(err)
      return res.json({
        success: true,
        status: 200,
        users,
      })
    })
  },
  get: (req, res) => {
    const { user } = req
    User.findById(user._id, '-password -__v -created', (err, usr) => {
      if (err) return res.status(500).json(err)
      if (!usr) {
        return res.status(403).json({
          success: false,
          message: 'User not found',
        })
      }
      return res.json({
        success: true,
        user: usr,
      })
    })
  },

  /**
   * Check Password
   * NB: check req id with current user in req.user
   * avoid check for other user password on api route, if not admin
   */
  checkPassword: (req, res) => {
    const { id } = req.params
    const { password } = req.body
    if (!id) {
      return res.status(403).json({
        success: false,
        action: 'check password',
        message: 'No user id provided',
      })
    }
    if (!password) {
      return res.status(403).json({
        success: false,
        action: 'check password',
        message: 'No user password provided',
      })
    }
    // Not request user account
    if (id !== req.user._id && !req.user.admin) {
      return res.status(401).json({
        success: false,
        action: 'check password',
        message: 'Accessing another account resources, access forbiden.',
      })
    }
    return User.findOne({ _id: id })
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          message: 'No user found',
        })
      }
      return user.checkPassword(password)
    })
    .then((check) => {
      return res.status(check.success ? 200 : 401).json({
        status: check.success ? 200 : 401,
        success: check.success,
        action: 'check password',
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        message: err.message ? err.message : err,
        action: 'check password',
      })
    })
  },

  /**
   * Change Password
   * NB: check req id with current user in req.user
   * avoid check for other user password on api route, if not admin
   */
  changePassword: (req, res) => {
    const { id } = req.params
    const { password, newPassword } = req.body
    let fetchedUser
    if (!id) {
      return res.status(403).json({
        success: false,
        action: 'check password',
        message: 'No user id provided',
      })
    }
    if (!password) {
      return res.status(403).json({
        success: false,
        action: 'check password',
        message: 'No user password provided',
      })
    }
    // Not request user account
    if (id !== req.user._id && !req.user.admin) {
      return res.status(401).json({
        success: false,
        action: 'check password',
        message: 'Accessing another account resources, access forbiden.',
      })
    }
    return User.findOne({ _id: id })
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          message: 'No user found',
        })
      }
      fetchedUser = user
      return user.checkPassword(password)
    })
    .then((check) => {
      if (!check.success) {
        return Promise.reject({
          message: 'Password not correct.',
          status: 401,
        })
      }
      fetchedUser.password = newPassword
      return fetchedUser.save()
    })
    .then((user) => {
      return user.auth()
    })
    .then((token) => {
      token.success = true
      token.status = 200
      token.user = {
        admin: fetchedUser.admin,
        email: fetchedUser.email,
        username: fetchedUser.username,
        _id: fetchedUser._id,
      }
      return res.json(token)
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        message: err.message ? err.message : err,
        action: 'check password',
      })
    })
  },

  /**
   * Change Email
   * NB: check req id with current user in req.user
   * avoid check for other user password on api route, if not admin
   */
  changeEmail: (req, res) => {
    const { id } = req.params
    const { email } = req.body
    if (!id) {
      return res.status(403).json({
        success: false,
        action: 'user change email',
        message: 'No user id provided',
      })
    }
    if (!email) {
      return res.status(403).json({
        success: false,
        action: 'user change email',
        message: 'No user email provided',
      })
    }
    // Not request user account
    if (id !== req.user._id && !req.user.admin) {
      return res.status(401).json({
        success: false,
        action: 'user change email',
        message: 'Accessing another account resources, access forbiden.',
      })
    }
    return User.find({ email })
    .then((users) => {
      if (users.length) {
        return Promise.reject({
          status: 403,
          message: 'User with this email already exist',
        })
      }
      return User.findOne({ _id: id })
    })
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          message: 'User not foun',
        })
      }
      user.email = email
      return user.save()
    })
    .then((user) => {
      return res.json({
        success: true,
        action: 'user change email',
        user,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        message: err.message ? err.message : err,
        action: 'user change email',
      })
    })
  },

  auth: (req, res) => {
    const { body: user } = req
    let fetchedUser
    return User.findOne({ email: user.email }).exec()
    .then((usr) => {
      if (!usr) {
        return Promise.reject({
          message: 'User not found!',
          status: 404,
        })
      }
      fetchedUser = usr
      return fetchedUser.checkPassword(user.password)
    })
    .then(() => {
      return fetchedUser.auth()
    })
    .then((token) => {
      token.success = true
      token.status = 200
      token.user = {
        email: fetchedUser.email,
        admin: fetchedUser.admin,
        username: fetchedUser.username,
        _id: fetchedUser._id,
      }
      return res.json(token)
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        message: err.message ? err.message : err,
      })
    })
  },
  create: (req, res) => {
    const { body: newUser } = req
    const user = new User({
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      admin: newUser.admin,
    })

    User
    .count({})
    .exec()
    .then((count) => {
      if (!count) user.admin = true
      if (!req.appSetting || req.appSetting.joinAllowed) {
        return user.save()
      }
      return Promise.reject({
        action: 'create user',
        success: false,
        status: 403,
        message: 'Register disabled, contact the administrator',
      })
    })
    .then(() => {
      if (process.env.NODE_ENV !== 'production') {
        new Setting({ joinAllowed: true }).save()
      } else {
        new Setting().save()
      }
      return user.auth()
    })
    .then((token) => {
      return res.json(token)
    })
    .catch((err) => {
      if (err.code && err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'User exists.',
        })
      }
      return res.status(500).json({
        success: false,
        message: err.message ? err.message : 'Some error occured.',
      })
    })
  },
  exist: (req, res) => {
    const username = req.body.username || req.params.username
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'No username provided!',
      })
    }
    return User.findOne({ username }, (err, usr) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      if (!usr) {
        return res.status(200).json({
          success: true,
          exist: false,
        })
      }
      return res.status(409).json({
        success: true,
        exist: true,
      })
    })
  },
  usernameExist: (req, res) => {
    const username = req.body.username || req.params.username
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'No username provided!',
      })
    }
    return User.userExist('username', username)
      .then((usr) => {
        if (!usr) {
          return res.status(200).json({
            success: true,
            exist: false,
          })
        }
        return res.status(409).json({
          success: true,
          exist: true,
        })
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err,
        })
      })
  },
  userEmailExist: (req, res) => {
    const email = req.body.email || req.params.email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'No user email provided!',
      })
    }
    return User.userExist('email', email)
      .then((usr) => {
        if (!usr) {
          return res.status(200).json({
            success: true,
            exist: false,
          })
        }
        return res.status(409).json({
          success: true,
          exist: true,
        })
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err,
        })
      })
  },
  adminDelete: (req, res) => {
    const userId = req.body.id || req.params.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'No user id provided',
      })
    }
    return User.findById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      if (user.admin) {
        return res.status(403).json({
          success: false,
          message: 'Delete admin user not allowed',
        })
      }
      return user.remove((removeError) => {
        if (removeError) {
          return res.status(500).json({
            success: false,
            message: err,
          })
        }
        return res.json({
          success: true,
          message: `User ${user.username} remove!`,
        })
      })
    })
  },
  delete: (req, res) => {
    const { user } = req
    User.findById(user._id, (err, usr) => {
      if (err) return res.status(500).json(err)
      if (!usr) {
        return res.status(404).json({
          success: false,
          message: `User ${user.username} don't exists!`,
          status: 404,
        })
      }
      return usr.remove((error, del) => {
        if (error) return res.status(500).json(error)
        return res.json({
          success: true,
          message: `User ${del.username} removed.`,
        })
      })
    })
  },
}
