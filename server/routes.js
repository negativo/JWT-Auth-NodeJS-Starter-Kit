/**
  * controllers
  */
const UserCtrl = require('./controllers/user.controller')

/**
 * middleware
 */
const Auth = require('./middlewares/auth.middleware')


module.exports = (express, app) => {
  const api = express.Router()

  api.get('/', (req, res) => {
    return res.json({
      success: true,
      message: 'Api Route',
    })
  })

  /**
   * USERS
   */
  api.get('/users', Auth('admin'), UserCtrl.index)
  api.post('/user/auth', UserCtrl.auth)
  api.post('/user', UserCtrl.create)
  api.post('/user/:id/check-password', Auth(), UserCtrl.checkPassword)
  api.post('/user/:id/change-password', Auth(), UserCtrl.changePassword)
  api.post('/user/:id/change-email', Auth(), UserCtrl.changeEmail)
  api.get('/user/:username/exist', UserCtrl.exist)
  api.get('/user/username/:username/exist', UserCtrl.usernameExist)
  api.get('/user/email/:email/exist', UserCtrl.userEmailExist)
  api.delete('/user/:id', Auth('admin'), UserCtrl.adminDelete) // admin delete any user

  /**
   * ACCOUNT
   */
  api.get('/me', Auth(), UserCtrl.get) // personal data
  api.delete('/me', Auth(), UserCtrl.delete) // delete it's own account

  api.all('*', (req, res) => {
    return res.status(404).json({
      success: false,
      status: 404,
      error: 'The route your are looking for doesn\'t exist!',
    })
  })

  app.use('/api', api)
}
