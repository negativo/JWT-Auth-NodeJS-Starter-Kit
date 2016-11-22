const secrets = require('./config/secrets')
const mime = require('mime')
const path = require('path')
const multer = require('multer')

/**
  * controllers
  */
const UserCtrl = require('./controllers/user.controller')
const MediaCtrl = require('./controllers/media.controller')
const SettingCtrl = require('./controllers/setting.controller')
const PublicCtrl = require('./controllers/public.controller')
const EmailCtrl = require('./controllers/email.controller')
const PostCtrl = require('./controllers/post.controller')

/**
 * middleware
 */
const AuthRequired = require('./middlewares/auth.middleware')

/**
 * UPLOADER
 */
const storage = multer.diskStorage({
  destination: path.join(__dirname, `../${secrets.UPLOAD_DIRNAME}/`),
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${mime.extension(file.mimetype)}`)
  },
})

const upload = multer({ storage })


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
  api.post('/user/auth', UserCtrl.auth)
  api.post('/user', UserCtrl.create)
  api.post('/user/:id/check-password', AuthRequired(), UserCtrl.checkPassword)
  api.post('/user/:id/change-password', AuthRequired(), UserCtrl.changePassword)
  api.post('/user/:id/change-email', AuthRequired(), UserCtrl.changeEmail)
  api.get('/user/:username/exist', UserCtrl.exist)
  api.get('/user/username/:username/exist', UserCtrl.usernameExist)
  api.get('/user/email/:email/exist', UserCtrl.userEmailExist)
  api.get('/users', AuthRequired('admin'), UserCtrl.index)
  api.delete('/user/:id', AuthRequired('admin'), UserCtrl.adminDelete)

  /**
   * MEDIAS
   */
  api.get('/medias', AuthRequired(), MediaCtrl.index)
  api.get('/medias/:type', AuthRequired(), MediaCtrl.indexByType)
  api.get('/media/:id', MediaCtrl.get)
  api.post('/media', AuthRequired(), MediaCtrl.create)
  api.patch('/media/:id/metadata', AuthRequired(), MediaCtrl.edit)
  api.delete('/media/:id', AuthRequired(), MediaCtrl.delete)
  api.post('/media/upload', AuthRequired(), upload.single('media'), MediaCtrl.upload)

  /**
   * POSTS
   */
  api.get('/admin/posts', AuthRequired(), PostCtrl.index)

  api.get('/admin/post/:id', AuthRequired(), PostCtrl.getSingle)

  api.post('/admin/post', AuthRequired(), PostCtrl.create)
  api.patch('/admin/post/:id', AuthRequired(), PostCtrl.edit)
  api.delete('/admin/post/:id', AuthRequired(), PostCtrl.delete)
  api.post('/admin/post/:id/featured', AuthRequired(), upload.single('postFeatured'), PostCtrl.uploadFeatured)
  api.delete('/admin/post/:id/featured', AuthRequired(), PostCtrl.postMediaRemove)

  /**
   * ACCOUNT
   */
  api.get('/me', AuthRequired(), UserCtrl.get)
  api.delete('/me', AuthRequired(), UserCtrl.delete)

  /**
   * SETTING
   */
  api.get('/setting', AuthRequired(), SettingCtrl.get)
  api.patch('/setting', AuthRequired(), SettingCtrl.edit)

  /**
   *  EMAIL
   */

  api.post('/email', EmailCtrl.send)

  api.all('*', (req, res) => {
    return res.status(404).json({
      success: false,
      status: 404,
      error: 'The route your are looking for doesn\'t exist!',
    })
  })

  app.use('/api', api)

  /**
   * ADMIN SPA
   */
  app.get(/^\/(login|register|admin)/, (req, res) => res.render('admin'))

  /**
   * PUBLIC ROUTES
   */
  app.get('/', PublicCtrl.homeRender)
  app.get('*', (req, res) => {
    return res.render('errors', {
      status: 404,
      message: 'The resource your are looking don\'t exist!',
    })
  })
}
