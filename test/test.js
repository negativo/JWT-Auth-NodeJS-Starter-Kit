global.Promise = require('bluebird')
global.testenv = {}
/**
 * SETUP
 */
const path = require('path')
testenv.rootdir = path.join(__dirname, '../')
testenv.app = path.join(testenv.rootdir, 'api.js')
testenv.serverdir = path.join(testenv.rootdir, 'server/')

global.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Boilerplate TEst
 */

require('./server/server.test.js')

require('./users/user.model.test.js')
require('./users/user.api.test.js')
