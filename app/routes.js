var User           = require('./models/user.model');
var UserController = require('./controllers/user.controller')(User);
var MainController = require('./controllers/main.controller')(User);
var AuthController = require('./controllers/auth.controller')(User);

var AuthMiddle = require('./middlewares/auth.middleware.js');

module.exports = function (express, app) {

  var apiRoutes = express.Router();

  app.get('/', Main.index );

  app.get('/setup', Main.setup );

  /**
   * API
   */
  app.use('/api', apiRoutes);
  apiRoutes.post('/auth', Auth.authenticate );

  apiRoutes.use(MainController.checkToken);

  apiRoutes.get('/', Main.apiIndex );
  apiRoutes.get('/users', AuthMiddle('admin'), UserController.getAll);

  /**
   * TESTs
   */
  apiRoutes.get('/check'      , Main.check );
  apiRoutes.get('/check-admin', AuthMiddle('admin'), Main.adminCheck );

}
