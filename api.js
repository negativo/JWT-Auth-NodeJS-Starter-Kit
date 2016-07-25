var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken'); 
var config = require('./config'); 
var User   = require('./controllers/models/user'); 
var UserController = require('./controllers/api/user.js')(User);
var Main = require('./controllers/api/main.js')(User);
var Auth = require('./controllers/api/auth.js')(User,jwt);
var port = process.env.PORT || 8282; 

mongoose.connect(config.database); 
app.set('superSecret', config.secret); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/setup', Main.setup );
app.get('/', Main.index );

var apiRoutes = express.Router();

apiRoutes.use(Auth.checkToken);
apiRoutes.post('/authenticate', Auth.authenticate );
apiRoutes.get('/', Main.apiIndex );
apiRoutes.get('/users',UserController.getAll);
apiRoutes.get('/check', Main.check );
app.use('/api', apiRoutes);

app.listen(port);

console.log('JWT API at http://localhost:' + port);
