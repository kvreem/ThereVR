
const { Router } = require('express');
const { makeResponse, async } = require('../helpers/index');

const Room = require('../models/room.model').model;
const User = require('../models/user.model').model;

const {io} = require('../io.js');

const api = new Router();

const getUser = async(function *(userid) {
	var user = yield User.findOne({
		user_id: userid
	}).exec();

	return user;
})

// a user is trying to enter another room while actively in a room
const handleActiveRoom = async(function *(user, activeRoom) {
	activeRoom.activeUsers.splice(
		activeRoom.activeUsers.indexOf(user._id),
		1
	);

	// End the call.
	// if (activeRoom.activeUsers.length == 1 && activeRoom.users.length == 2) {
	// 	activeRoom.activeUsers = [];
	// }

	yield activeRoom.save();

	io.emit("rooms:create", activeRoom);
});

// get all rooms user is in
api.get('/rooms/:userid', async(function *(req, res) {

	try {

		var user = yield getUser(req.params.userid);

		var rooms = yield Room.find({
			users: user
		}).sort({lastUpdate: -1}).exec();

		res.send({success: true, results: rooms});

	} catch(e) {

		res.send({success: false, error: e.toString()});

	}

}));

// either creates or join an existing room
api.post('/rooms/create/:userid', async(function *(req, res) {

	try {
		var user = yield getUser(req.params.userid);

		// find any existing active rooms and leave them

		var activeRoom = yield Room.findOne({
			activeUsers: user
		});

		if (activeRoom) {
			yield handleActiveRoom(user, activeRoom)
		}

		// create room

		var recipients = [];

		if (req.body.recipients.length == 0) {
			throw "Not enough recipients";
		}

		for (var id of req.body.recipients) {
			recipients.push(yield getUser(id));
		}

		var room;

		// if we are doing a 1 on 1, just reuse the previous room
		if (recipients.length == 1) {
			room = yield Room.findOne({
				users: {$all: [user, ...recipients]},
				'users.2': {$exists: false}
			});

			if (room) {
				if (room.rejectedUsers.length == 0) {
					if (room.activeUsers.indexOf(user._id) == -1) {
						room.activeUsers.push(user._id);
					}
				} else {
					room.activeUsers = [user];
					room.rejectedUsers = [];
				}

				room.lastUpdate = new Date();
			}
		}

		if (!room) {
			room = new Room({
				users: [user, ...recipients],
				activeUsers: [user],
				rejectedUsers: [],
				acceptedUsers: [],
				lastUpdate: new Date()
			});
		} else {
			console.log("found a room, don't create one!");
		}


		yield room.save();

		io.emit("rooms:create", room);

		res.send({success: true, room: room});
	} catch(e) {
		res.send({success: false, error: e.toString()});
	}

}));

api.post('/rooms/accept/:userid', async(function *(req, res) {

	try {
		var currentUser = yield getUser(req.params.userid);

		// first lets find a room that we might be actively in

		var activeRoom = yield Room.findOne({
			activeUsers: currentUser
		});

		if (activeRoom) {
			yield handleActiveRoom(currentUser, activeRoom);
		}

		// next lets actually join a room

		var room = yield Room.findOne({
			_id: req.body.roomid
		}).exec();

		if (room.activeUsers.indexOf(currentUser._id) != -1) {
			room.activeUsers.splice(
				room.activeUsers.indexOf(currentUser._id),
				1
			);
		}

		if (room.rejectedUsers.indexOf(currentUser._id) != -1) {
			room.rejectedUsers.splice(
				room.rejectedUsers.indexOf(currentUser._id),
				1
			);
		}

		if (room.acceptedUsers.indexOf(currentUser._id) == -1) {
			room.acceptedUsers.push(currentUser._id);
		}

		room.activeUsers.push(currentUser);
		
		room.lastUpdate = new Date();

		yield room.save();

		io.emit("rooms:accept", room);

		res.send({success: true, room});
	} catch(e) {
		res.send({success: false, error: e.toString()});
	}

}));

api.post('/rooms/reject/:userid', async(function *(req, res) {

	try {
		var currentUser = yield getUser(req.params.userid);

		var room = yield Room.findOne({
			_id: req.body.roomid
		}).exec();

		if (room.activeUsers.indexOf(currentUser._id) != -1) {
			room.activeUsers.splice(
				room.activeUsers.indexOf(currentUser._id),
				1
			);
		}

		if (room.rejectedUsers.indexOf(currentUser._id) != -1) {
			room.rejectedUsers.splice(
				room.rejectedUsers.indexOf(currentUser._id),
				1
			);
		}

		room.rejectedUsers.push(currentUser);

		yield room.save();

		io.emit("rooms:reject", room);

		res.send({success: true, room});
	} catch(e) {
		res.send({success: false, error: e.toString()});
	}

}));

api.get('/room/current/:userid', async(function *(req, res) {

	try {
		var currentUser = yield getUser(req.params.userid);

		var activeRoom = yield Room.findOne({
			activeUsers: currentUser
		});

		res.send({success: true, activeRoom});
	} catch(e) {
		res.send({success: false, error: e.toString()});
	}

}));

api.get('/room/:roomid', async(function *(req, res) {

	try {
		var room = yield Room.findOne({
			_id: req.params.roomid
		}).exec();

		if (room)
			res.send({success: true, room});
		else
			res.send({success: false});
	} catch(e) {
		res.send({success: false, error: e.toString()});
	}

}));

module.exports = () => api;
