const bodyParser = require('body-parser');

// Add middlewares to express.
function expressConfig(app) {
  app.use(bodyParser.json({
    limit: '50mb',
  }));

  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }));
}

module.exports = expressConfig;
