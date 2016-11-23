if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({
    path: '.env.production',
  })
} else {
  require('dotenv').config({
    path: '.env',
  })
}
global.Promise = require('bluebird')

process.title = `node.${process.env.NODE_TITLE}`
global.__root = __dirname

const PORT = process.env.PORT || 3000
const express = require('express')
const routes = require('./server/routes')
const globalMiddlewares = require('./server/middlewares/global.middleware')

const app = express()

/**
 * GLOBAL MIDDLEWARES
 */
globalMiddlewares(express, app)

/**
 * ROUTE HANDLERS
 */
routes(express, app)

/**
 * START
 */
app.listen(PORT, () => {
  /* eslint no-console: off */
  console.log(`Server started on ${PORT}`)
  console.log(`Node App process named: ${process.title}`);
})

module.exports = app
