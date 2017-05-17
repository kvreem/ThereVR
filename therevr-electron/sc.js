
// require('electron-cookies')

var {ipcRenderer} = require("electron");

var handler = () => {};

ipcRenderer.on('facebook-response-handler', (event, res) => {
  console.log(res);
  console.log("oh");
  handler(res);
});

ipcRenderer.on('color-stream', (color) => {
  setColorVidStream(color);
})

FB = {init: (config) => {

  window.clickFacebookButton = function (responseHandler) {
    handler = responseHandler;
    ipcRenderer.send("facebook-button-clicked", config);
  };
  // window.location = "https://www.facebook.com/help/contact/logout?id=260749603972907";

}}

document.addEventListener('DOMContentLoaded', () => {
  window.fbAsyncInit();
  FB = undefined;
})

window.hookElectronApp = (cb) => {
  cb(require);
}

window.startStream = (roomId, userId) => {
	ipcRenderer.send("start-stream", {host: window.location.host, roomId, userId});
}

window.endStream = () => {
    ipcRenderer.send("end-stream");
}


window.addEventListener('beforeunload', (e) => {
	window.endStream();
})

ipcRenderer.send('request-bluetooth');

var bluetoothCb = () => {}
window.onFoundBluetooth = ((cb) => {
  bluetoothCb = cb;
})

ipcRenderer.on('found-bluetooth', (event, bluetooth) => {
  window.blueDeviceList = bluetooth;
  bluetoothCb(bluetooth);
  console.log("///FOUND BLUETOOTH " + JSON.stringify(bluetooth))
});

window.connectBluetooth = (deviceName) => {
  ipcRenderer.send('connect-bluetooth', deviceName);
}

///
/*
console.log("yup");

document.addEventListener('DOMContentLoaded', () => {

	var $ = require('jquery');

	console.log("everything ready yo");
	setTimeout(() => {

		document.go = function (path) {
			history.pushState({}, "", path);
			history.pushState({}, "", "/");
			history.go(-1);
		}

		var playControls = $(".playControls");
		playControls.bind("DOMSubtreeModified", (e) => {
			console.log(e);
			console.log("tree changed");
		})
		console.log(playControls);

	}, 0);
});
*/