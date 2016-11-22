const Settings = require('../models/setting.model')

module.exports = (app) => {
  return (req, res, next) => {
    Settings.findOne({}, (err, setting) => {
      if (err || !setting) return next();
      req.appSetting = setting;
      app.set('appSetting', setting);
      return next()
    })
  }
}
