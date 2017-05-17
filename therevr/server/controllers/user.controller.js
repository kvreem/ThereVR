const User = require('../models/index').user;
const Contact = require('../models/index').contact;
const aws = require('aws-sdk');
const request = require('request');
const { makeResponse, async } = require('../helpers/index');
/* eslint-disable*/

/**
 * Returns a mongo query as a promise
 * @param userId - Id of a user
 * @returns Promise
 */
function getByUserId(userId) {
  return User.findOne({ user_id: userId }).exec();
}

/**
 * Get all user
 * @param req
 * @param res
 * @returns All User data
 */
function allUser(socket, req, res) {
  function* findUsers() {
    try {
      const foundUser = yield User.find({}).exec();
      res.json(makeResponse(true, foundUser));
    }
    catch (err) {
      res.status(400).json(makeResponse(false, err));
    }
  }

  async(findUsers)();
}

/**
 * Makes a user object for S3
 * @param user - Object that describe a new user.
 * @returns Object for S3.
 *
 * Formats the object to be sent to S3.
 */
function makeUserObj(user) {
  // const user = req.body;
  const temp = /\/([A-Z0-9_-]{1,}\.(?:png|jpg|gif|jpeg))/i.exec(user.fb_picture);
  const filename = temp[1];
  const filetype = (/[^\\]*\.(\w+)$/.exec(filename))[1];
  const url = `https://graph.facebook.com/${user.user_id}/picture?type=large`;

  const s3Object = {
    url,
    filename,
    filetype,
    user,
  };

  return s3Object;
}

function putUserOnline(user) {
  user.status = 'online';

  user.save();
  return user;
}

/**
 * Save a user
 * @param req
 * @param res
 * @returns void
 * Checks if a user exists, if it does it grabs the user information from mongo
 * and returns it. If the user does not exist, it is created. Creating a user
 * involves making a new entry into mongo and uploading the profile picture to
 * S3.
 */
function addUser(req, res) {
  const invalidParams = 'Please pass in a email, name and user_id';
  if (!req.body.name /*|| !req.body.email*/ || !req.body.user_id) {
    return res.status(403).json(makeResponse(false, invalidParams));
  }

  if (!req.body.email) {
    req.body.email = req.body.user_id + "@not-real-therevr.com";
  }

  function* uploadUser() {
    try {
      const user = req.body;

      // Henry: add contacts by facebook id
      for (var friend of user.friends) {
        try {
          console.log(friend);
          const contact = yield new Contact({
            connection: [user.user_id, friend.id]
          });
          yield contact.save();
        } catch(e) {
          console.log(e);
        }
      }
      //

        // console.log(user);
      const userExists = yield getByUserId(user.user_id);
      if (userExists) {
        userExists.friends = user.friends;
        userExists.save();
        const friends = [];
        const savedUser = yield putUserOnline(userExists);
        for (let i = 0; i < savedUser.friends.length; i += 1) {
          const friend = savedUser.friends[i];
          const friendModel = yield getByUserId(friend.id);

          yield friends.push(friendModel);
        }
        const removeNulls = friends.filter((item) => {
          if (item !== null) return item;
        });
        return res.json(makeResponse(true, [savedUser, removeNulls]));
      }

      let unSavedUsersFriends = [];
      for (let i = 0; i < user.friends.length; i += 1) {
        const friend = user.friends[i];
        const friendModel = yield getByUserId(friend.id);

        yield unSavedUsersFriends.push(friendModel);
      }

      if (unSavedUsersFriends.includes(null)) unSavedUsersFriends = unSavedUsersFriends.filter((item) => {
        if (item !== null) return item;
      });

      console.log(unSavedUsersFriends);

      const s3Params = yield makeUserObj(user);
      const bucketParams = yield uploadToS3(s3Params);
      yield upload(bucketParams, res, unSavedUsersFriends);
    }
    catch(err) {
      console.log(err);
      res.status(400).json(makeResponse(false, err));
    }
  }

  async(uploadUser)();
}

/**
 * Save a user
 * @param S3Obj - Object describing S3 params.
 * @returns promise
 *
 * Uploads the user profile pic to S3 and returns the data of the uploaded pic.
 */
function uploadToS3(S3Obj) {
  const { url, filename, filetype, user } = S3Obj;
  const options = { uri: url, encoding: 'binary' };

  const promiseRequest = new Promise(
    (resolve, reject) => {
      request.get(options, (error, response, data) => {
        if (error) return reject(error);

        if (!error && response.statusCode === 200) {
          const responseData = {
            body: {
              data_uri: data,
              filename,
              filetype,
              user,
            },
          };
          resolve(responseData);
            // upload(req, res);
        }
      })
    }
  );

  return promiseRequest;
}

function upload(req, res, friends){
  console.log('maaade it');
  console.log(req.body);
  console.log(req.user);
  var data = req.body.data_uri,
      filename = req.body.filename,
      filetype = req.body.filetype,
      user_data = req.body.user,
      params = {
          Bucket: "therevr",
          Key: user_data.user_id,
          Expires: 60,
          ContentType: filetype
      },
      photoBucket = new aws.S3({params: {Bucket: 'therevr'}});

  if(user_data._id == null){
    data = new Buffer(data, 'binary');
  }else{
    data = new Buffer(data.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  }

  photoBucket
  .upload({
      ACL: 'public-read',
      Body: data,
      Key: user_data.user_id,
      ContentType: 'application/octet-stream' // force download if it's accessed as a top location
  })
  .on('httpUploadProgress', (evt) => { console.log(evt); })
  .send((err, data) => {
    if (err) {

        console.error(err);
        return res.status(500).send('failed to upload to s3').end();
    }else{
        // let user = new User(user_data);
        console.log(data)
        user_data.profile_picture = data.Location;

        User.findOne({user_id: user_data.user_id}, (err, saved)=>{
          if (err) {
            return res.status(500).send(err).end();
          }
          console.log(saved);
          if(saved == null){
            let newUser = new User(user_data);
            newUser.save((err, saved) => {
              if (err) {
                console.log(err)
                return res.status(500).send(err).end();
              }
              return res.status(200).json({ success: true, content: [saved, friends] }).end();
            });
          }else{
            return res.status(200).json({ success: true, content: [saved, friends] }).end();
          }

        })
    }
  });
}

/**
 * Change a users status
 * @param req
 * @param res
 *
 * Changes the passed in users status.
 */
function ChangeStatus(io, req, res) {
  const { status, user_id } = req.body;

  function* changeUsersStatus() {
    try {
      const currentUser = yield getByUserId(user_id);
      currentUser.status = status;
      yield currentUser.save();

      // Emiting to all sockets that someone changed there status
      const socketObj = { user_id: currentUser.user_id, status: currentUser.status };
      io.emit('status:change', socketObj);
      return res.json(makeResponse(true, currentUser));
    }
    catch(err) {
      res.status(400).json(makeResponse(false, err));
    }
  };

  async(changeUsersStatus)();
}

/**
 * Update users recent ids
 * @param req
 * @param res
 *
 * Updates the users recent_ids.
 */
function updateRecent(req, res){
  const { user_id, recent_ids } = req.body;

  function* updateRecentsContacts() {
    try {
      const currentUser = yield getByUserId(user_id);

      currentUser.recent = recent_ids;
      yield currentUser.save();
      return res.json(makeResponse(true, currentUser));
    }
    catch(err) {
      console.log(err);
      res.status(400).json(makeResponse(false, err));
    }
  };

  async(updateRecentsContacts)();
}

module.exports = {
  allUser,
  updateRecent,
  ChangeStatus,
  upload,
  uploadToS3,
  addUser,
};
