
try {
  var addon = require('./build/Release/therenect.node');
  module.exports = addon;
} catch (e) {

  try {
    var addon = require('./bin/therenect.node');
    module.exports = addon;
  } catch (e2) {
    
  }

}
// var fs = require('fs');
// var PNG = require('pngjs').PNG;


// console.log(addon.hello()); // 'world'



console.log('oooohhh');

/*
var interval = setInterval(() => {
  addon.update();
  // console.log((new Date()).getTime());
  // console.log(addon.getHead())

  // console.log(addon.getFrame())

  // var skeleton = addon.getHead();
  // console.log(skeleton);
  // if (skeleton.head.x !== 0 && skeleton.head.y !== 0 && skeleton.head.z !== 0) {
  //   fs.appendFileSync("./kinect_log.json", JSON.stringify(skeleton) + ",\n");
  // }

  var frame = addon.getFrame();
  if (frame.data) {
    if (frame.w != 0) {
      var png = new PNG({
        width: frame.w,
        height: frame.h,
        filterType: 4
      });


      for (var i = 0; i < frame.data.length; i++) {
        var depth = frame.data[i*3];
        png.data[i*4] = frame.data[i*3];
        png.data[i*4+1] = frame.data[i*3+1];
        png.data[i*4+2] = 0;
        png.data[i*4+3] = 255;
      }


      png.pack().pipe(fs.createWriteStream('out.png'));;

    }

  }
}, 50)
*/

// var Primus = require('primus');

// var Socket = Primus.createSocket({ transformer: 'websockets' })
//  , client = new Socket('http://localhost:3000');

// client.write('I am Therenect');

// client.on('data', function(data) {
//   console.log(data);
// })
