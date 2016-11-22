const mongoose = require('mongoose')
const secrets = require('./secrets')
mongoose.Promise = require('bluebird')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB Connection Error. Please make sure that MongoDB is running.'))

db.once('open', () => {
  console.log(`-- db connection --`)
})

db.on('close', () => {
  console.log(`-- db disconnect --`)
})

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(secrets.TEST_DB_URI)
} else {
  mongoose.connect(secrets.DB_URI)
}
process.emit('event:mongodb_connected')

module.exports = mongoose
