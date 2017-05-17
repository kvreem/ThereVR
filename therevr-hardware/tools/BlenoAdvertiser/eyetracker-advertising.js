let bleno = require('bleno');

let name = 'therevr-origin';
let serviceUUIDs = ['fffffffffffffffffffffffffffffff0'];

bleno.on('stateChange', (state) => {
  if (state === 'poweredOn')
  {
    bleno.startAdvertising(name, serviceUUIDs);
  }
  else
  {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', (err) => {
  console.log('on -> advertisingStart: ' + (err ? 'error ' + err : 'success'));
});