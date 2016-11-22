module.exports = (express, app) => {
  const morgan = require('morgan')
  const bodyParser = require('body-parser')

  /**
   * LOGGING
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

  /**
   * IF BEHIND PROXY SERVER
   */
  app.set('trust proxy', 1)

  /**
   * Append requested FQDN
   */
  app.use((req, res, next) => {
    req.fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    next()
  })
}
