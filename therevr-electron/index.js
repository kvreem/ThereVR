
const {app, BrowserWindow, ipcMain, session} = require('electron');
const url = require('url');
const path = require('path');
const FB = require('fb');

const NotificationCenter = require('node-notifier').NotificationCenter;

console.log(app.getPath('userData'));

// const basepath = "localhost:8000";
const basepath = "therevr.herokuapp.com";

var notifier = new NotificationCenter({
  withFallback: false//, // Use Growl Fallback if <= 10.8
  // customPath: void 0 // Relative/Absolute path to binary if you want to use your own fork of terminal-notifier
});


let win;

app.commandLine.appendSwitch('disable-renderer-backgrounding');

app.on('ready', () => {
	
	const streamer = require('./streamer');

	console.log('ready!!!!')
	win = new BrowserWindow({width: 800, height: 640,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, 'sc.js')
		}});
	win.loadURL(url.format({
		pathname: basepath + "/",
		protocol: 'http:',
		slashes: true
	}));
	win.webContents.openDevTools();

	var authWindow;

	ipcMain.on("facebook-button-clicked",function (event, arg) {
		if (authWindow) {
			authWindow.show();
			return;
		}

		var options = {
			client_id: arg.appId,
			scopes: "user_friends,public_profile,email,user_location,read_custom_friendlists",
			redirect_uri: "http://" + basepath + "/"
		};
		authWindow = new BrowserWindow({ width: 689, height: 336, resizable: false, show: false, 'node-integration': false, nodeIntegration: false, webPreferences: { preload: path.join(__dirname, 'cookies.js') } });
		// authWindow.webContents.openDevTools();
		var facebookAuthURL = "https://m.facebook.com/dialog/oauth?client_id=" + options.client_id + "&redirect_uri=" + options.redirect_uri + "&response_type=token,granted_scopes&scope=" + options.scopes + "&display=popup";
		authWindow.loadURL(facebookAuthURL);
		authWindow.show();
		authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
			console.log('oh no!!');
			var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
			access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
			error = /\?error=(.+)$/.exec(newUrl);
			console.log(error);
			if(access_token) {
				console.log(access_token);
				FB.setAccessToken(access_token);
				FB.api('/me', { fields: ['id', 'name', 'email', 'picture.width(800).height(800)', 'friends'] }, function (res) {
					console.log(res.id);
					console.log(res.name);
					res.friends = res.friends.data;
					console.log(res.friends);
					win.webContents.send('facebook-response-handler', res);
				});
				authWindow.close();
			}
		});
		authWindow.on('closed', () => {
			authWindow = null;
		})
	});

	win.webContents.on('dom-ready', () => {
		console.log("ready");
	})
})
