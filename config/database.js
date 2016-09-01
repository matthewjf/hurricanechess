var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.database, function(){console.log('connected to db');});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Running `mongod`?');
});

module.exports = mongoose;
