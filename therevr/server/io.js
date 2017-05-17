
const {server} = require('./app.js');

// Socket.io
const io = require('socket.io')(server);

// Socket.io connections
io.on('connection', (socket) => {
  socket.on('call:beingPlaced', (callInfo) => {
    // callInfo has the ids of the caller and being called
    // This will most likely be tweaked
    io.emit('call:room', callInfo);
  });

  socket.on('call:end', (callInfo) => {
    io.emit('call:ended', callInfo);
  });
});

module.exports = {io};
