var User           = require('./models/user.model');
var UserController = require('./controllers/user.controller')(User);
var Main           = require('./controllers/main.controller')(User);
var Auth           = require('./controllers/auth.controller')(User);

var AuthMiddle = require('./middlewares/auth.middleware.js');

module.exports = function (express, app) {

  var apiRoutes = express.Router();

  app.get('/', Main.index );

  app.get('/setup', Main.setup );

  /**
   * API
   */
  app.use('/api', apiRoutes);

  apiRoutes.get('/', Main.apiIndex );
  apiRoutes.post('/auth', Auth.authenticate );
  apiRoutes.get('/users', AuthMiddle('admin'), UserController.getAll);

  /**
   * TESTs
   */
  apiRoutes.get('/check'      , AuthMiddle()       , Main.check );
  apiRoutes.get('/check-admin', AuthMiddle('admin'), Main.adminCheck );

}
