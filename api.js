require('dotenv').load();

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var config     = require('./app/config/config');
var database   = require('./app/config/database');
var routes     = require('./app/routes');
var port       = process.env.PORT || 8282;
var parseToken = require('./app/middlewares/parsetoken.middleware');


database.connect();

app.set('superSecret', config.secret); // req config.secret or process.env.APP_SECRET where app is not present

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if( process.env.NODE_ENV === 'dev' ){
  app.use(morgan('dev'));
}
app.use(parseToken);
routes(express, app);

app.listen(port, function(){
  console.log('JWT API at http://localhost:' + port);
});

module.exports = app;
