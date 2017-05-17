const mongoose = require('mongoose');

// Connect to mongo DB
function mongoConfig() {
  /* eslint no-console: 0*/
  // Sets mongoose promise to ES-6 promises, gets rid on deprication warning.
  mongoose.Promise = global.Promise;

  mongoose.connect(process.env.MONGO_URI);
  mongoose.connection
    .on('error', console.error.bind(console, 'connection error:'))
    .once('open', () => {
      console.log('Mongo DB connected and ready to go!');
    });
}

module.exports = mongoConfig;
