/* eslint consistent-return:0 */

const express = require('express');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
// Config files
const setup = require('./middlewares/frontendMiddleware');
const serverConfig = require('./config/index');
// Enviroment variables
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
// Routes
const addRoutes = require('./routes/index');

const resolve = require('path').resolve;
const env = require('node-env-file');
const path = require('path');

const rooms = require('./rooms');
const {app, server} = require('./app.js');
const {io} = require('./io.js');

// Bringing in server .env file for enviroment variables (database, aws keys ect...)
env(path.join(__dirname, '/.env'));

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

app.get('/env.config.js', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.send(`window.env = "${process.env.NODE_ENV}"`);
});

rooms(io);
serverConfig(app);
addRoutes(app, io);

app.use('/public', express.static(path.join(__dirname, 'public')));

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 8000;

// Start your app.
server.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
