const awsConfig = require('./aws');
const expressConfig = require('./express');
const mongoConfig = require('./mongo');

const configFiles = [awsConfig, expressConfig, mongoConfig];

// Loop through config functions and pass them app.
function serverConfig(app) {
  for (let i = 0; i < configFiles.length; i += 1) {
    configFiles[i](app);
  }
}

module.exports = serverConfig;
