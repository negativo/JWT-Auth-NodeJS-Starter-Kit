var mongoose = require('mongoose');
var config = require('./config');

mongoose.Promise = global.Promise;
var db = mongoose.connection;

module.exports = {
  connect: () => {

    db.on('error',
      console.error.bind(console, 'MongoDB Connection Error. Please make sure that MongoDB is running.')
    );

    db.once('open', () => {

      process.emit('event:mongodb_connected');

    });

    if(process.env.NODE_ENV === 'TEST'){

      mongoose.connect(config.test_database);

    } else {

      mongoose.connect(config.database);

    }

    return db;
  },
  info: () => {
    //  MongoDB status (0 = disconnected; 1 = connected; 2 = connecting; 3 = disconnecting)
    return db.readyState;
  }
}
