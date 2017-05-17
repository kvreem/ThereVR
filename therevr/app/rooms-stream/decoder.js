
import jsmpeg from './jsmpg';

// wraps around jsmpeg
// later, needs to wrap around kinect

class Decoder {
	constructor(width, height, canvas) {
		this.canvas = canvas;

		this.jsmpeg = new jsmpeg(canvas);
		this.jsmpeg.initSocketClient();
		this.jsmpeg.width = width;
		this.jsmpeg.height = height;
		this.jsmpeg.initBuffers();
	}

	update(chunk) {
		this.jsmpeg.receiveSocketMessage(chunk);
	}
}

export default Decoder;
