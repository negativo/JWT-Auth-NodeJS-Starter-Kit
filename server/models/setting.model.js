const mongoose = require('../config/database')

const SettingShema = mongoose.Schema({
  sitename: { type: String, default: 'MyReactReduxPortfolio' },
  joinAllowed: { type: Boolean, default: false },
  mailContact: { type: String, default: 'mail@example.com' },
}, {
  capped: { max: 1 },
})

module.exports = mongoose.model('Setting', SettingShema)
