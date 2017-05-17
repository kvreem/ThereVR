const userRoutes = require('./user.routes');
const contactRoutes = require('./contact.routes');
const roomRoutes = require('./room.routes');
const allRoutes = [userRoutes, contactRoutes, roomRoutes];

function addRoutes(app, io) {
  for (let i = 0; i < allRoutes.length; i += 1) {
    const makeRoute = allRoutes[i](io);
    app.use('/api', makeRoute);
  }
}

module.exports = addRoutes;
