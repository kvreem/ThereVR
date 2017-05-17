
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { userSchema } = require('./user.model');

const roomSchema = new Schema({
	users: [ Schema.Types.ObjectId ],
	activeUsers: [ Schema.Types.ObjectId ], // users that have accepted an invitation to the room
  acceptedUsers: [ Schema.Types.ObjectId ],
	rejectedUsers: [ Schema.Types.ObjectId ],
	lastUpdate: { type: Date, default: Date.now() }
});

module.exports = {
	model: mongoose.model("Room", roomSchema),
	roomSchema
};
