
const path = require('path');

const fn = (...args) => {
  console.log(path.relative(process.cwd(), path.join(__dirname, ...args)));
}

const fn2 = (...args) => {
  console.log(path.join(__dirname, '..', '..',  ...args));
}

module.exports = {
  OpenNI2: {
    // lib: () => fn2( 'OpenNI-MacOSX-x64-2.2', 'Redist' ),
    lib: () => fn2( ),
    inc: () => fn( 'OpenNI-MacOSX-x64-2.2', 'Include' )
  },

  NiTE2: {
    lib: () => fn2( ),
    // lib: () => fn2( 'NiTE-MacOSX-x64-2.2', 'Redist' ),
    inc: () => fn( 'NiTE-MacOSX-x64-2.2', 'Include' )
  },

  freenect2: {
    lib: () => fn2( 'freenect2' )
  }
}
