var User           = require('./models/user.model');
var UserController = require('./controllers/user.controller')(User);
var MainController = require('./controllers/main.controller')(User);
var AuthController = require('./controllers/auth.controller')(User);

var AuthMiddle = require('./middlewares/auth.middleware.js');

module.exports = function (express, app) {

  var apiRoutes = express.Router();

  app.get('/', MainController.index );
  app.get('/setup', MainController.setup );

  app.use('/api', apiRoutes);

  apiRoutes.post('/auth', AuthController.authenticate );
  apiRoutes.get('/', MainController.apiIndex );

  apiRoutes.use( AuthMiddle() );

  apiRoutes.post('/users', UserController.create);
  apiRoutes.get('/users', UserController.getAll);
  apiRoutes.get('/users/:id', UserController.view);
  apiRoutes.put('/users/:id', UserController.update);
  apiRoutes.delete('/users/:id', UserController.delete);


  apiRoutes.get('/check'      , MainController.check );
  apiRoutes.get('/check-admin', AuthMiddle('admin'), MainController.adminCheck );

}
