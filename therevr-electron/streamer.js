
const {app, ipcMain}	= require('electron');

const ffmpeg 					= require('fluent-ffmpeg');
const Writable 				= require('stream').Writable;
const Readable 				= require('stream').Readable;
const EventEmitter 		= require('events');
const tracking 				= require('./tracking.js');
// const { graphical, Rectangle, Circle } = require('graphical');
// const Split = require('stream-split');
// const splitter = new Split(Buffer.from([0x00, 0x00, 0x01, 0xB3]));

const Headset = require('./bluetooth-streamer.js');

const therenect 			= require('./therenect');

// graphical(1234);

// var rects = [1,2,3,4,5,6,7,8,9].map(() => new Rectangle());
// rects.forEach((rect) => { rect.setColor('transparent'); rect.setOutlineColor('red'); rect.setOutlineWidth(2) })
// var rect = new Rectangle();
// var circle = new Circle();
// circle.setColor("blue");

/*
* 169, 71, 71
*	172, 74, 76
* 218, 115, 115
* 164, 72, 86
* 174, 85, 85
* 143, 53, 34
* 96, 50, 40
* 130, 75, 40
*/

tracking.ColorTracker.registerColor('orange', function(r, g, b) {
	if (r > 90 && r > g && r > b && (g - b) < 25 && (r - g) > 40 && (r - b) > 40 && r/g > 1.5 && r/b > 1.5) {
		return true;
	}

	return false;
});

var eyePos = {x: 0, y: 0};

var sender;
var bluDevList;
ipcMain.on('request-bluetooth', (event) => {
	sender = event.sender;
	console.log('yo ' + sender);
	console.log(bluDevList);
	if (sender) { sender.send('found-bluetooth', bluDevList ? bluDevList.map((dev) => dev.advertisement.localName).filter((dev) => dev) : []) };
})


ipcMain.on('connect-bluetooth', (event, deviceName) => {
	var deviceObj = bluDevList.filter((dev) => dev.advertisement.localName == deviceName)[0];
  if (deviceObj) headset.connectToDevice(deviceObj);
});

var headset = new Headset();
headset.on('deviceDiscovered', (deviceList) => {
	bluDevList = deviceList;
	console.log(deviceList.map((dev) => dev.advertisement.localName).filter((dev) => dev));
	if (sender) { sender.send('found-bluetooth', deviceList.map((dev) => dev.advertisement.localName).filter((dev) => dev)) };
  deviceList.forEach((device)=> {
    console.log(device.advertisement.localName);
      
    if (device.advertisement.localName === 'tvro1')
    {
      // headset.connectToDevice(device);
    }
  });
});

headset.on('eyepos', (position) => {
  console.log('eye position change');
  console.log(JSON.stringify(position));
  eyePos.x = position.x;
  eyePos.y = position.y;
});

function convert2Dto3D(x, y, depthMap) {

	var newX = Math.floor(x/512*128);
	var newY = Math.floor(y/512*128);
	var r = depthMap[(newX + newY*128) * 3];
	var g = depthMap[(newX + newY*128) * 3 + 1] * 256;
	// var d = depthMap.readInt16LE((Math.floor(x/512*128) + Math.floor(y/512*128)*128) * 3);
	// console.log((r + g) + "\t\t" + r + "\t" + (g/256));

	// console.log(Math.floor(x/512*128 + y/512*128*128) * 2, r, g, depthMap.length-1);

	var fX = ((x / 512) - 0.5)*4;
	var fY = ((y / 512) - 0.5)*4;

	var depthVal = 1.0 - ((r + g) / 1500.0);
  if (depthVal > 0.99 || depthVal < 0.01) {
    depthVal = 0.0;
  }
	// var depthVal = 1.0 - d / 1500.0;

  var fSkeletonZ = depthVal;
  var fSkeletonX = fX * 1.12005 * depthVal;
  var fSkeletonY = fY * 0.84072 * depthVal;


	return {
		x: fSkeletonX,
		y: fSkeletonY,
		z: fSkeletonZ - 0.5
	};
}

var headPosition2D = {x: 0, y: 0};
var tracker = new tracking.ColorTracker(['orange']);
tracker.setColors(['orange'])
tracker.setMinDimension(10);
tracker.on('track', function(event) {
	var rectList = event.data.filter((rect) => {
		return rect.width * rect.height > 1000;
	});

	if (rectList.length > 0) {
		var firstRect = rectList[0];

		var avgX = 0;
		var avgY = 0;
		var stdevX = 0;
		var stdevY = 0;
		var count = 0;

		// for (var i in rects) {
		// 	var rect = rects[i];
		// 	var r = rectList[i];
		// 	if (r) {
		// 		rect.setPos(r.x, r.y);
		// 		rect.setSize(r.width, r.height);
		// 	} else {
		// 		rect.setSize(0, 0);
		// 	}
		// }

		rectList.forEach((rect) => {
			var dim = rect.width * rect.height;
			avgX += (rect.x + rect.width/2) * dim;
			avgY += (rect.y + rect.height/2) * dim;
			count += dim;
		});

		avgX /= count;
		avgY /= count;

		// circle.setPos(avgX, avgY);
		headPosition2D.x = avgX;
		headPosition2D.y = avgY;

		/*
		event.data.forEach((rect) => {
			var diffX = avgX - (rect.x + rect.width/2);
			var diffY = avgY - (rect.y + rect.height/2);
			stdevX += diffX * diffX;
			stdevY += diffY * diffY;
		});

		stdevX /= count;
		stdevY /= count;


		var minX = firstRect.x,
				minY = firstRect.y,
				maxX = firstRect.x + firstRect.width,
				maxY = firstRect.y + firstRect.height;

		event.data.forEach((rect) => {
			minX = Math.min(minX, rect.x);
			minY = Math.min(minY, rect.y);
			maxX = Math.max(maxX, rect.x + rect.width);
			maxY = Math.max(maxY, rect.y + rect.height);
		})

		headPosition2D.x = (minX + maxX)/2;
		headPosition2D.y = (minY + maxY)/2;
		*/

	}

	// console.log('event', event);
})

const width = 512;
const height = 512;

var io = require('socket.io-client');

// const Socket = Primus.createSocket({
// 	transformer: 'websockets',
// 	parser: 'binary'
// });

class KinectListener extends EventEmitter {
	constructor() {
		super();

		this.time = Date.now();

		setInterval(() => {
			
			therenect.update();

			var frame = therenect.getFrame();
			var skeleton = therenect.getHead();

			if (frame && frame.dataColor && frame.w > 0) {
				if (Date.now() - this.time >= 100) {
					this.time = Date.now();
					this.emit('frame', {frame, skeleton});
				}
			}

			if (frame && frame.dataColor)
				this.emit('hiframe', {frame, skeleton})

			// this.frame = frame;
			// this.skeleton = skeleton;

		}, 100);

		setInterval(() => {

			// if (this.frame && this.frame.data && this.frame.w > 0) {
			// 	this.emit('frame:lowfps', {frame: this.frame, skeleton: this.skeleton});
			// }

		}, 200)
	}
}

const kinect = new KinectListener;

// var frameTimeQueue = [];
// var frameDelayQueue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var counter = 0;

class SocketPipe extends Writable {
  constructor(options, socket) {
    super(options);
    this.socket = socket;

  }
  _write(chunk, encoding, callback) {
		const streamId = new Buffer(2);
		streamId.writeUInt16BE(1994);

		chunk = new Buffer(chunk);

		// this.bigChunk = Buffer.concat([this.bigChunk, chunk]);
		// this.chunkLength += chunk.length;

		// console.log(chunk.length);

		this.socket.emit('rooms:data', Buffer.concat([streamId, chunk]));

		// if (this.chunkLength > 8000) {
			// this.bigChunk = new Buffer(0);
			// this.chunkLength = 0;
		// }

		// var lastFrame = frameTimeQueue.splice(0,1)[0]
		// if (lastFrame) {
		// 	frameDelayQueue.push(Date.now() - lastFrame);
		// 	if (frameDelayQueue.length > 20) {
		// 		frameDelayQueue.splice(0,1);
		// 	}
		// }

  	callback();
  }
}

var lastData = {};

class KinectStream extends Readable {
	constructor(opts) {
		super(opts)
	}

	_read() {

		// frameTimeQueue.push(Date.now());

		// kinect.once('hiframe', (data) => {
		kinect.once('hiframe', (data) => {
			var { frame } = data;
			if (frame && frame.dataColor) {
				this.push(frame.dataColor);
			}

			if (!lastData)
				lastData = data;
		})

	}
}

app.on('before-quit', () => {
	console.log('sick');
	therenect.close();
	console.log('sick');
})

// app.on('ready', () => {
	var command, socket;

	ipcMain.on("start-stream", (event, config) => {
		if (command) command.kill();
		command = null;
		if (socket) socket.close();
		socket = null;
		kinect.removeAllListeners('frame');

		console.log(config.host);
		socket = io.connect(`http://${config.host}/`);

		// socket = new WebSocket('127.0.0.1:8000');
		// primus = new Socket('http://therevr-streamer.herokuapp.com/');

		socket.on('connect', () => {
			socket.emit('rooms:connect', {
				room: config.roomId,
				fbUserID: config.userId,
				type: 'broadcaster',
				width,
				height
			});
		})

		socket.on('rooms:data', (data) => {
			// debug(data);
		});


		var start = function(initialFrame) {
			command = ffmpeg('') // See above article
				.on('start', function(commandLine) {
					console.log('Spawned Ffmpeg with command: ' + commandLine);
				})

			    // Set input format (depends on OS, will not work if this isn't correct!)
		    .input('0:0')
				.inputFormat('avfoundation')
				.inputOption('-s 640x480')
				.inputOption('-framerate 30')
				.inputOption('-pixel_format uyvy422')
				.fps('30')

				.on('end', function() {
				console.log('file has been converted succesfully');
				})
				.on('error', function(err) {
				console.log('an error happened: ' + err.message);
				})

				.format('mpeg1video')
				.addOutputOption('-b 100k')
				.addOutputOption('-r 30');

			command
			    .pipe(new SocketPipe(null, socket), {end:true});
		}



		////////

		var startKinect = function(initialFrame) {

			kinect.on('frame', (data) => {
				if (!lastData) return;

				var { frame, skeleton } = lastData;

				if (!frame) { lastData = null; return };

				var { dataColor, dataDepth, xzFactor, yzFactor } = frame;

				var headPos = convert2Dto3D(headPosition2D.x, headPosition2D.y, dataDepth);
/*
				var colorMapResized = new Buffer(64*64*3);
				for (var y = 0; y < 64; y++) {
					for (var x = 0; x < 64; x++) {
						var rX = Math.floor(x / 64 * 512);
						var rY = Math.floor(y / 64 * 512);
						var i = 0;
						colorMapResized[i*3] = dataColor.readUInt8((rX + rY*512)*3);
						colorMapResized[i*3 + 1] = dataColor.readUInt8((rX + rY*512)*3 + 1);
						colorMapResized[i*3 + 2] = dataColor.readUInt8((rX + rY*512)*3 + 2);

						// console.log(dataColor.readUInt8((rX + rY*512)*3), (rX + rY*512)*3);
					}
				}*/

				tracker.track(dataColor, 512, 512);

				// console.log(colorMapResized.length);

				// var delay = frameDelayQueue.reduce((a, b) => a + b, 0) / frameDelayQueue.length;;
				// console.log("delay: " + delay);

				// setTimeout(() => {
					if (socket)
						socket.emit('rooms:data', { skeleton, dataDepth, headPosition2D, headPos, eyePos });
				// }, delay);

				lastData = null;

			})

			
			command = ffmpeg('') // See above article
				.on('start', function(commandLine) {
					console.log('Spawned Ffmpeg with command: ' + commandLine);
				})

				.input(new KinectStream())
				.inputFormat('rawvideo')
				.inputOption(`-s ${initialFrame.w}x${initialFrame.h}`)
				.outputOption(`-s 128x128`)
				// .inputOption('-framerate 30.0')
				.inputOption('-pixel_format rgb24')
				// .fps('15')

				.on('end', function() {
				console.log('file has been converted succesfully');
				})
				.on('error', function(err) {
				console.log('an error happened: ' + err.message);
				})

				.format('mpeg1video')
				.addOutputOption('-b 200k')
				.addOutputOption('-r 30');

			command
			    .pipe(new SocketPipe(null, socket), {end:true});
			
		}

		kinect.once('frame', (data) => {
			var { frame } = data;
			startKinect(frame);
		})

		console.log("start stream");
	})

	ipcMain.on("end-stream", (event) => {
		if (command) command.kill();
		command = null;
		if (socket) socket.close();
		socket = null;

		kinect.removeAllListeners('frame');

		console.log("end stream");
	})
// })
