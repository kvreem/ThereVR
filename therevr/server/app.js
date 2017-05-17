
const express = require('express');
const path = require('path');

const app = express();
const server = require('http').Server(app);

app.use(express.static('public'));

module.exports = {app, server};
