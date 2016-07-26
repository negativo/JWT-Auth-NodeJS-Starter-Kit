var User           = require('./models/user.model');
var UserController = require('./controllers/user.controller')(User);
var MainController = require('./controllers/main.controller')(User);
var AuthController = require('./controllers/auth.controller')(User);

var AuthMiddle = require('./middlewares/auth.middleware.js');

module.exports = function (express, app) {

  var apiRoutes = express.Router();

  app.get('/', MainController.index );
  app.get('/setup', MainController.setup );

  /**
   * API public endpoint
   */
  app.use('/api', apiRoutes);
  apiRoutes.post('/auth', AuthController.authenticate );
  apiRoutes.get('/', MainController.apiIndex );


  apiRoutes.use( AuthMiddle() );

  /**
   * API private endpoint
   */

  apiRoutes.get('/users', AuthMiddle('admin'), UserController.getAll);

  /**
   * TESTs
   */
  apiRoutes.get('/check'      , MainController.check );
  apiRoutes.get('/check-admin', AuthMiddle('admin'), MainController.adminCheck );

}
