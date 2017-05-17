const { Router } = require('express');
const { userController } = require('../controllers/index');

const router = new Router();

function addUserRoutes(io) {
  router.route('/users').post(userController.addUser);

  // By binding io we will have access to it as the first param of the function.
  router.route('/users').get(userController.allUser.bind(this, io));

  // By binding io we will have access to it as the first param of the function.
  router.route('/change_status').post(userController.ChangeStatus.bind(this, io));

  router.route('/upload_file').post(userController.upload);

  router.route('/update_recent').post(userController.updateRecent);

  // Upload user's facebook profile picture
  // router.route('/upload').post(GeneralController.upload2s3);

  return router;
}
// Add a new Post


module.exports = addUserRoutes;
