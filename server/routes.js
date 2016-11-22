/**
  * controllers
  */
const UserController = require('./controllers/user.controller')

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
  api.get('/users', Auth('admin'), UserController.index)
  api.post('/user/auth', UserController.auth)
  api.post('/user', UserController.create)
  api.post('/user/:id/check-password', Auth(), UserController.checkPassword)
  api.post('/user/:id/change-password', Auth(), UserController.changePassword)
  api.post('/user/:id/change-email', Auth(), UserController.changeEmail)
  api.get('/user/:username/exist', UserController.exist)
  api.get('/user/username/:username/exist', UserController.usernameExist)
  api.get('/user/email/:email/exist', UserController.userEmailExist)
  api.delete('/user/:id', Auth('admin'), UserController.adminDelete) // admin delete any user

  /**
   * ACCOUNT
   */
  api.get('/me', Auth(), UserController.get) // personal data
  api.delete('/me', Auth(), UserController.delete) // delete it's own account

  /**
   * Catch-all 404
   */
  api.all('*', (req, res) => {
    return res.status(404).json({
      success: false,
      status: 404,
      error: 'The route your are looking for doesn\'t exist!',
    })
  })

  app.use('/api', api)

  app.post('/setup', UserController.setup)
}
