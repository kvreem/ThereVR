
import webvr from 'webvr-polyfill';

var THREE = require('three');
import './threejs/VRControls2.js';
import './threejs/VREffect.js';
import WEBVR from './threejs/WebVR.js';

import './tracking.js/tracking.js';
import './tracking.js/dat.gui.js';
import { initGUIControllers } from './tracking.js/color_camera_gui.js';

import './webvr.config.js';

import React from 'react';

import { selectRooms } from 'containers/AuthHoc/selectors.js';

import Decoder from './decoder';
import './jsmpg';
import './roomstream.js';

import { socket } from 'services/socket/index.js'

import dmapFragmentShader from './dmapFragmentShader.js';
import dmapVertexShader from './dmapVertexShader.js';

import EyeObject from './eyes.js';

import skyboxPathNX from 'images/textures/skybox/Skybox_NegativeX.jpg'
import skyboxPathNY from 'images/textures/skybox/Skybox_NegativeY.jpg'
import skyboxPathNZ from 'images/textures/skybox/Skybox_NegativeZ.jpg'
import skyboxPathPX from 'images/textures/skybox/Skybox_PositiveX.jpg'
import skyboxPathPY from 'images/textures/skybox/Skybox_PositiveY.jpg'
import skyboxPathPZ from 'images/textures/skybox/Skybox_PositiveZ.jpg'

const cubeLoader = new THREE.CubeTextureLoader();

const skyboxTexture = cubeLoader.load( [
	skyboxPathPX, skyboxPathNX,
	skyboxPathPY, skyboxPathNY,
	skyboxPathPZ, skyboxPathNZ
] );

if ( WEBVR.isAvailable() === false ) {

	document.body.appendChild( WEBVR.getMessage() );

}

console.log(webvr);

class Room extends React.Component {
	static count = 0;

	constructor(props) {
		super(props);

		this.state = {
			userMap: {}
		};
	}

	componentDidMount() {

		Room.count++;

		if (Room.count > 1) {
			console.log("Should never be more than 1 room!");
		}

		if (window.hookElectronApp) {
			window.startStream(this.props.roomId, this.props.currentUser.user_id);
		}

		// calculate local position of users
		this.userPositions = {};

		this.usersList = this.props.room.users.map((user) => {
			return parseInt( user.data.user_id )
		});
		this.usersList.sort();

		console.log(this.usersList);

		for (var user of this.usersList) {
			var i = this.usersList.indexOf(user);
			this.userPositions[user] = {};

			var m1 = new THREE.Matrix4();
			var rot1 = new THREE.Euler();
			var m2 = new THREE.Matrix4();
			var rot2 = new THREE.Euler();

			this.userPositions[user].pos = new THREE.Vector3(Math.cos(i * Math.PI / this.usersList.length * 2) * 0.5, 0, Math.sin(i * Math.PI / this.usersList.length * 2) * 0.5);

			m1.lookAt(this.userPositions[user].pos, new THREE.Vector3(0,0,0), THREE.Object3D.DefaultUp)
			rot1.setFromRotationMatrix(m1);
			this.userPositions[user].ang = rot1;

			m2.lookAt(new THREE.Vector3(0,0,0), this.userPositions[user].pos, THREE.Object3D.DefaultUp)
			rot2.setFromRotationMatrix(m2);
			this.userPositions[user].ang2 = rot2;
		}

		this.currentUserPosition = this.userPositions[parseInt( this.props.currentUser.user_id )];
		console.log(this.currentUserPosition);

		//
		this.startRoomRender();

	}

	startRoomRender() {

		if (this.state.roomRendered) return;

		console.log("//////!!")

		this.setState({
			roomRendered: true
		});

		socket.on('rooms:data', this.onData);
		socket.on('rooms:initial', this.onInitial);
		socket.on('rooms:enter', this.onEnter);
		socket.on('rooms:leave', this.onLeave);
		socket.on('rooms:orientation', this.onHeadGear);

		console.log("RENDER", parseInt( this.props.currentUser.user_id ));

		socket.emit('rooms:connect', {
			type: 'client',
			room: this.props.roomId,
			fbUserID: parseInt( this.props.currentUser.user_id )
		});

		// ThreeJS

		// const width = window.innerWidth,
		// 			height = window.innerHeight / 2;

		const width = 640,
					height = 480;

		this.renderer = new THREE.WebGLRenderer({ canvas: this.refView });
		this.renderer.setSize(width, height);
		this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 20);
		// this.camera.position.z = 1;
		this.scene = new THREE.Scene();
		this.scene.add(this.camera);
		this.camera.position.copy(this.currentUserPosition.pos);
		this.camera.rotation.copy(this.currentUserPosition.ang);

		if (this.props.canvasHidden) {

			this.controls = new THREE.VRControls( this.camera );
			this.effect = new THREE.VREffect( this.renderer );

			this.controls.position.copy(this.currentUserPosition.pos);
			this.controls.rotation.copy(this.currentUserPosition.ang);

			if ( navigator.getVRDisplays ) {

				navigator.getVRDisplays()
				.then( function ( displays ) {
					this.effect.setVRDisplay( displays[ 0 ] );
					this.controls.setVRDisplay( displays[ 0 ] );
				} )
				.catch( function () {
					// no displays
				} );

				document.body.appendChild( WEBVR.getButton( this.effect ) );

			}

			window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
			window.addEventListener( 'click', this.onWindowClick.bind(this), false );

			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();

			if (this.effect)
				this.effect.setSize( window.innerWidth, window.innerHeight );

			this.requestAnimationFrame = this.effect.requestAnimationFrame;

			this.headInt = setInterval(() => {
				socket.emit('rooms:headgear', {
					type: 'client',
					orientation: this.controls.orientation
				});
			}, 200)

		} else {
			window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
			this.requestAnimationFrame = (fn) => requestAnimationFrame(fn);
			this.renderer.setSize(window.innerWidth - 300, window.innerHeight - 100);
			this.camera.aspect = (window.innerWidth - 300) / (window.innerHeight - 100);
			this.camera.updateProjectionMatrix();
		}

		this.active = true;
		this.requestAnimationFrame(this.animationFrame.bind(this));

		this.scene.background = skyboxTexture;

		// table
		
		// this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

		// var light = new THREE.DirectionalLight( 0xffffff );
		// light.position.set( 1, 1, 1 ).normalize();
		// this.scene.add( light );

		// var tableGeometry = new THREE.BoxGeometry( 0.15, 0.15, 0.15 );		
		// var table = new THREE.Mesh( tableGeometry, new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
		// table.position.set(0,-0.3,0);
		// this.table = table;
		// this.scene.add(table);
		// console.log("///TABLE");

	}

	endRoomRender() {

		socket.off('rooms:data', 	this.onData);
		socket.off('rooms:initial', this.onInitial);
		socket.off('rooms:enter', 	this.onEnter);
		socket.off('rooms:leave', 	this.onLeave);
		socket.off('rooms:orientation', 	this.onHeadGear);

		this.active = false;
		
	}

	onWindowClick() {
		this.controls.resetPose();
	}

	onWindowResize() {
		if (this.props.canvasHidden) {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();

			if (this.effect)
				this.effect.setSize( window.innerWidth, window.innerHeight );
		} else {
			this.renderer.setSize(window.innerWidth - 300, window.innerHeight - 100);
			this.camera.aspect = (window.innerWidth - 300) / (window.innerHeight - 100);
			this.camera.updateProjectionMatrix();
		}
	}

	animationFrame() {
		if (!this.active) return;
		this.requestAnimationFrame(this.animationFrame.bind(this));


		if (this.goalQuaternion)
	    this.camera.quaternion.slerp( this.goalQuaternion, 0.05 );

		var i = 0;
		for (var id in this.state.userMap) {

			var user = this.state.userMap[id];
			var { texture, mesh } = user;
      texture.needsUpdate = true;
			i++;
		}

		// this.camera.rotation.y = Math.sin(Date.now() / 1000)/3;

		if (this.props.canvasHidden) {
			this.controls.update();
	    this.effect.render(this.scene, this.camera);
	  } else {
	  	this.renderer.render(this.scene, this.camera);
	  }
	}

	enter(user) {
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');

		this.canvasCollection.appendChild(canvas);

		// this.vrStuff(canvas);

		// var decoder = new Decoder(user.width, user.height, canvas);
		var decoder = new Decoder(128, 128, canvas);
		var texture = new THREE.Texture(canvas);
		texture.magFilter = THREE.LinearFilter;
		texture.minFilter = THREE.LinearFilter;

		// var dataColorTexture = new Uint8Array(64*64*3).map(() => { return Math.floor(Math.random()*255); });
		// var colorMapTexture = new THREE.DataTexture( dataColorTexture, 64, 64, THREE.RGBFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.LinearFilter, THREE.LinearFilter, 1 )
		// colorMapTexture.needsUpdate = true;
		// var texture = colorMapTexture;

		var dataDepthTexture = new Uint8Array(128*128*3).map(() => { return Math.floor(Math.random()*255); });
		var depthMapTexture = new THREE.DataTexture( dataDepthTexture, 128, 128, THREE.RGBFormat, THREE.UnsignedByteType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 1 )
		depthMapTexture.needsUpdate = true;

		// var material = new THREE.MeshDepthMaterial({ displacementMap: dataDepthTexture, map: colorMapTexture });
		// var material = new THREE.MeshBasicMaterial({ map: texture });


		var material = new THREE.ShaderMaterial( {
		    // color: 0xffffff,
		    uniforms: Object.assign( {},
		      THREE.UniformsLib.common,
		      {opacity: { value: 3.0 }},
		      {depth: { value: 3.0 }},
		      {map: { type: 't', value: depthMapTexture }},
		      {colorMap: { type: 't', value: texture }}
		    ),
		    vertexShader: dmapVertexShader,
		    fragmentShader: dmapFragmentShader,
		    transparent: true
		    // map: cubeTexture
		});


		var meshWrapper = new THREE.Object3D();
		meshWrapper.position.z = -0.5;

		/// headgear

		var headGearGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );		
		var headGear = new THREE.Mesh( headGearGeometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff,
		    transparent: true } ) );
		headGear.position.set(0,0,0);
		meshWrapper.add(headGear);

		var leftEye = new EyeObject();
		headGear.add(leftEye);
		leftEye.position.set(-0.1,0,0.1);

		var rightEye = new EyeObject();
		headGear.add(rightEye);
		rightEye.position.set(0.1,0,0.1);

		///

		// var geometry = new THREE.BoxGeometry( 2, 2, 2 );
		var geometry = new THREE.PlaneGeometry( 1, 1, 128, 128 );
		var mesh = new THREE.Mesh( geometry, material );
		meshWrapper.add(mesh);

		var positions = this.userPositions[ parseInt( user.fbUserID ) ];

		var userObj = new THREE.Object3D();
		userObj.position.copy(positions.pos);
		userObj.rotation.copy(positions.ang2);
		userObj.add(meshWrapper);
		this.scene.add(userObj);

		// mesh.position.x = -10;

		// console.log(dataColorTexture);

		// draw where the headgear is

		// var blah = document.createElement('div');
		// blah.style.background = "red";
		// blah.style.position = "absolute";
		// blah.style.width = "5px";
		// blah.style.height = "5px";

		// document.body.appendChild(blah);


		this.state.userMap[user.userID] = {
			decoder,
			texture,
			mesh,
			userObj,
			headGear, 
			canvas,
			fbUserID: user.fbUserID,
			/*colorMapTexture, dataColorTexture,*/
			depthMapTexture, dataDepthTexture,
			material,
			leftEye, rightEye
		};

		this.setState({
			userMap: this.state.userMap
		});
	}

	leave(user) {
		var { decoder } = this.state.userMap[user.userID];
		if (decoder) {
			this.canvasCollection.removeChild(decoder.canvas);
			var { mesh, userObj } = this.state.userMap[user.userID];

			this.scene.remove(userObj);

			delete this.state.userMap[user.userID];

			this.setState({
				userMap: this.state.userMap
			});
		}
	}

	componentWillUnmount() {
		this.endRoomRender();

		Room.count--;

		if (window.hookElectronApp) {
			window.endStream(this.props.roomId);
		}

		window.removeEventListener( 'resize', this.onWindowResize.bind(this) );
		window.removeEventListener( 'click', this.onWindowClick.bind(this) );
		clearInterval( this.headInt );

	}

	componentWillReceiveProps(nextProp) {
		// console.log(nextProp)
	}

	onData = (data) => {
		if (data.dataDepth) {
			var {/*dataColor, */dataDepth, headPosition2D, userID, eyePos} = data;
			var {dataColorTexture, colorMapTexture, dataDepthTexture, depthMapTexture, material, headGear, blah, canvas, leftEye, rightEye} = this.state.userMap[userID];

			// dataColorTexture.set(new Uint8Array(data.dataColor));
			// colorMapTexture.needsUpdate = true;

			// leftEye.setEyePos(Math.cos(Date.now() / 1000), Math.sin(Date.now() / 1000));
			// rightEye.setEyePos(Math.cos(Date.now() / 1000), Math.sin(Date.now() / 1000));

			leftEye.setEyePos(eyePos.x, eyePos.y);
			rightEye.setEyePos(eyePos.x, eyePos.y);

			var depthArray = new Uint8Array(data.dataDepth);


			dataDepthTexture.set(depthArray);
			depthMapTexture.needsUpdate = true;

			// var colorArray = new Uint8Array(data.colorMapResized);
			// dataColorTexture.set(colorArray);
			// colorMapTexture.needsUpdate = true;

			// var rect = canvas.getBoundingClientRect();
			// blah.style.top = (headPosition2D.y + rect.top) + "px";
			// blah.style.left = (headPosition2D.x + rect.left) + "px";

			// headGear.position.set(data.headPos.x, -data.headPos.y, data.headPos.z - 0.5);
			headGear.position.set(data.headPos.x, -data.headPos.y, data.headPos.z + 0.5 - 0.05);
			// headGear.position.set(fSkeletonX, -fSkeletonY, fSkeletonZ - 0.05);

			// console.log(xzFactor, yzFactor);

			// material.uniforms.xzFactor = xzFactor;
			// material.uniforms.yzFactor = yzFactor;

			// console.log(data.dataColor)
		// } else if (data.skeleton) {
			// console.log(data.skeleton);

			// if (data.skeleton) {
			// 	for (var joint of this.jointsList) {

			// 		this.joints[joint]

			// 		var {x, y, z} = data.skeleton[joint];
			// 		var quat = data.skeleton[joint].quat;

			// 		this.joints[joint].position.x = x / 1000;
			// 		this.joints[joint].position.y = y / 1000;
			// 		this.joints[joint].position.z = z / 1000 - 2;
			// 		this.joints[joint].setRotationFromQuaternion(new THREE.Quaternion(
			// 			quat.x, quat.y, quat.z, quat.w
			// 		));

			// 	}
			// }
			// console.log( this.head.position )
		} else {
			var buffer = new Uint8Array(data);

			var userID = (buffer[0] << 8) + buffer[1];
			var { decoder } = this.state.userMap[userID];

			if (decoder) {
				decoder.update(buffer.subarray(2));
				// decoder.update(buffer);
			}
		}
	}

	onInitial = (data) => {
		console.log("INITIAL ", data);
		// console.log(data);
		for (var user of data.users) {
			if (this.state.userMap[user.userID]) continue;
			this.enter(user);
		}
	}

	onEnter = (data) => {
		this.enter(data.user)
	}

	onLeave = (data) => {
		console.log("///LEAVE")
		console.log(data.user);
		this.leave(data.user);
	}

	onHeadGear = (data) => {
		// var { headGear } = this.state.userMap[userID];
		var user;
		for ( var userID in this.state.userMap ) {
			var userCheck = this.state.userMap[userID];
			if (userCheck.fbUserID == data.fbUserID && userCheck.headGear) {
				user = userCheck;
				break;
			}
		}

		console.log(data.fbUserID, this.props.currentUser.user_id);

		if (data.fbUserID == parseInt(this.props.currentUser.user_id)) {

	    var q0 = this.camera.quaternion;

	    var q1 = new THREE.Quaternion();
	    var m1 = new THREE.Matrix4();
	    var m2 = new THREE.Matrix4();

	    q1.fromArray( data.orientation );
	    m1.makeRotationFromQuaternion( q1 );
      m2.makeRotationFromEuler( this.currentUserPosition.ang );

      m2.multiply(m1);
      q1.setFromRotationMatrix(m2);

      this.goalQuaternion = q1;
      // this.camera.setRotationFromMatrix( m2 );

		}

		// console.log("headgear");
		// console.log(data);

  //   var q1 = new THREE.Quaternion();
  //   var m1 = new THREE.Matrix4();

  //   q1.fromArray( data.orientation );
  //   m1.makeRotationFromQuaternion( q1 );

  //   console.log(m1);

  //   this.table.setRotationFromMatrix( m1 ); 

	}

	render() {
		return (
			<div ref='room' onMouseDown={() => this.onWindowClick.bind(this)}>
				<div ref={(ref) => {this.canvasCollection = ref}} style={{display: this.props.canvasHidden ? 'none' : ''}}>
				</div>
				<canvas style={{position: "absolute", left: "0", right: "0", top: "0", bottom: "0"}} ref={(ref) => this.refView = ref} width="100" height="100" />
			</div>
		);
	}
}

// var primus = new Primus("ws://" + window.location.host);
// var primus = new Primus("ws://" + window.location.hostname + ":3112");
// var primus = new Primus("ws://" + window.location.hostname + ":3112");
// var primus = new Primus("ws://therevr-streamer.herokuapp.com/");

/*
primus.write({
	cmd: 'connect',
	type: 'client',
	room: 2
});
*/

var body = document.querySelector('body');

var userMap = {};

function enter(user) {
	var canvas = document.createElement('canvas');
	canvas.width = user.width;
	canvas.height = user.height;
	body.appendChild(canvas);
	console.log(canvas);

	var decoder = new Decoder(user.width, user.height, canvas);
	userMap[user.userID] = decoder;
}

function leave(user) {
	var decoder = userMap[user.userID];
	if (decoder) {
		body.removeChild(decoder.canvas);
		delete userMap[user.userID];
	}
}

/*
primus.on('data', (data) => {
	if (data instanceof ArrayBuffer) {
		var buffer = new Uint8Array(data);

		var userID = (buffer[0] << 8) + buffer[1];
		var decoder = userMap[userID];

		if (decoder) {
			decoder.update(buffer.subarray(2));
		}
	} else {
		console.log(data);
		if (data.cmd == 'initial') {
			for (var user of data.users) {
				if (userMap[user.userID]) continue;

				enter(user);
			}
		} else if (data.cmd == 'enter') {
			enter(data.user)
		} else if (data.cmd == 'leave') {
			leave(data.user);
		}
	}
	// console.log(data.byteLength);
})*/

// const mapStateToProps = createStructuredSelector({
	// currentUser: selectCurrentUser,
	// rooms: selectRooms
	// contacts: selectContacts//,
	// room: makeSelectRoomWithContacts()
// });

// export default connect(mapStateToProps)(Room);

export default Room;
