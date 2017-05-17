
const http 			= require('http');
const path 			= require('path');


class Rooms {
	constructor() {
		this.rooms = {};
	}

	broadcast(roomID, cmd, ...data) {
		let room = this.rooms[roomID];

		if (room) {
			for (let spark of room.users) {
				spark.emit(cmd, ...data);
			}
		}
	}

	broadcastData(roomID, userID, cmd, ...data) {
		let room = this.rooms[roomID];

		if (room) {
			for (let spark of room.users) {
				if (spark.type != 'broadcaster' && spark.fbUserID != userID) {
					spark.emit(cmd, ...data);
				}
			}
		}
	}

	broadcastFilter2(roomID, userID, cmd, ...data) {
		let room = this.rooms[roomID];

		if (room) {
			for (let spark of room.users) {
				if (spark.type != 'broadcaster' && spark.userID != userID) {
					spark.emit(cmd, ...data);
				}
			}
		}
	}

	enter(roomID, spark) {
		let room = this.rooms[roomID];
		if (!room) {
			room = this.rooms[roomID] = {
				users: [],
				lastUserID: 1
			};
		}

		if (room.users.indexOf(spark) == -1) {
			room.users.push(spark);
		}

		room.lastUserID++;
		spark.userID = room.lastUserID;

		console.log(this.rooms);
	}

	users(roomID) {
		let room = this.rooms[roomID];

		return room.users.filter((user) => user.type != 'client').map((user) => {
			return {
				userID: user.userID,
				fbUserID: user.fbUserID,
				width: user.width,
				height: user.height
			}
		});
	}

	leave(roomID, spark) {
		const room = this.rooms[roomID];
		if (room && room.users.indexOf(spark) != -1) {
			room.users.splice(room.users.indexOf(spark), 1);
		}

		if (room && room.users.length == 0) {
			delete this.rooms[roomID];
		}

		console.log("LEFT");
		console.log(this.rooms);
	}
}

const rooms = new Rooms();

module.exports = (io) => {

	io.on('connection', (socket) => {
		console.log("connected");
		socket.on('rooms:data', (data) => {

			if (data.skeleton) {
				data.userID = socket.userID;
				rooms.broadcastData(socket.room, socket.fbUserID, 'rooms:data', data);
			} else {

				var magicNum = (data[0] << 8) + data[1];
				if (magicNum == 1994) {
					// replace magicnum in the buffer with user's id
					data.writeUInt16BE(socket.userID);
					rooms.broadcastData(socket.room, socket.fbUserID, 'rooms:data', data);
				}
				
			}

		})

		socket.on('rooms:headgear', (data) => {
			console.log(data);
			rooms.broadcastFilter2(socket.room, socket.userID, 'rooms:orientation', {
				userID: socket.userID,
				fbUserID: socket.fbUserID,
				orientation: data.orientation
			});
		});

		socket.on('rooms:connect', (data) => {
			if (socket.room) {
				rooms.leave(socket.room, socket);
			}
			rooms.enter(data.room, socket);

			socket.type = data.type;
			socket.width = data.width;
			socket.height = data.height;
			socket.room = data.room;
			socket.fbUserID = data.fbUserID;

			if (socket.type != 'client') {
				console.log(data.fbUserID)
				rooms.broadcast(socket.room, 'rooms:enter', {user: {
					userID: socket.userID,
					fbUserID: data.fbUserID,
					width: data.width,
					height: data.height
				}});
			}

			socket.emit('rooms:initial', {users: rooms.users(data.room)});
		})


		socket.on('disconnect', () => {
			rooms.leave(socket.room, socket);

			if (socket.type != 'client') {
				rooms.broadcast(socket.room, 'rooms:leave', {user: {
					userID: socket.userID,
					width: socket.width,
					height: socket.height
				}});
			}
		})

	});

}