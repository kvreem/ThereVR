
var THREE = require('three');

export default class EyeObject extends THREE.Object3D {
  constructor() {
    super();

    var geometry = new THREE.CircleGeometry( 0.07, 12 );
    var pupilGeometry = new THREE.CircleGeometry( 0.035, 12 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var pupilMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    var circle = new THREE.Mesh( geometry, material );
    var pupil = new THREE.Mesh( pupilGeometry, pupilMaterial );
    this.add( circle );
    circle.add(pupil);

    this.circle = circle;
    this.pupil = pupil;
  }

  setEyePos(x, y) {
    this.pupil.position.set(x * 0.035, y * 0.035, 0);
  }
}
