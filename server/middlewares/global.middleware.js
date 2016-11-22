module.exports = (express, app) => {
  const path = require('path')
  const morgan = require('morgan')
  const bodyParser = require('body-parser')
  const secrets = require('../config/secrets')
  const parseSettings = require('../middlewares/settings.middleware')(app)

  /**
   * LOGGIN
   * - replace with winston for prod and logrotate.
   */
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  } else {
    // const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    // app.use(morgan('combined', { stream: accessLogStream }))
  }

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(parseSettings)

  /**
  * TEMPALTE ENGINE
  */
  app.set('views', path.join(global.__root, './server/views'))
  app.set('view engine', 'pug');


  app.use(express.static(path.join(global.__root, 'public/'), {
    index: false,
  }))

  app.use(`/${secrets.UPLOAD_DIRNAME}`, express.static(`${secrets.UPLOAD_DIRNAME}/`, {
    fallthrough: false,
  }))

  /**
   * Append requested FQDN
   */
  app.use((req, res, next) => {
    req.requestedUrl = `https://${req.get('host')}${req.originalUrl}`
    res.locals.requestedUrl = req.requestedUrl
    next()
  })
}
