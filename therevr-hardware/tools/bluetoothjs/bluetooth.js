let EventEmitter = require('events');
let noble = require('noble');

class Headset extends EventEmitter {
  constructor() {
    super();
    this.bluetoothDevices = [];
    this.poweredOn = false;
    this.deviceName = undefined;
    this.eyeTrackerChr = undefined;
    
    this.eyeTrackerServiceUUID = '1802';
    this.eyeTrackerChrUUID = '2a06';
    this.deviceIdentifier = 'tvro2';
    this.thereVRInfo = {
      serviceUUID: '1802',
      chrUUID: '2a06',
      deviceId: 'tvro2'
    };
    
    this.axis_range =  {
      x_max: 0,
      x_min: 301,
      y_max: 0,
      y_min: 301
    };
    
    this._init();
  }

  _parseData(data) {
    let x = data.readInt32LE(0);
    let y = data.readInt32LE(4);

    // Get new max and min coordinates
    this.axis_range.x_min = Math.min(x, this.axis_range.x_min);
    this.axis_range.x_max = Math.max(x, this.axis_range.x_max);
    this.axis_range.y_min = Math.min(y, this.axis_range.y_min);
    this.axis_range.y_max = Math.max(y, this.axis_range.y_max);

    // Calculate centers
    let x_center = (this.axis_range.x_max + this.axis_range.x_min)/2;
    let y_center = (this.axis_range.y_max + this.axis_range.y_min)/2;

    // Calculate percentages
    if (x === x_center)
    {
      x = 0;
    } 
    else if (x === 0xFFFFFFFF)
    {
      x = undefined;
    }
    else 
    {
      let sign = x > x_center ? 1: -1;
      let x_offset = sign === 1 ? x - x_center : x_center - x;
      let x_range = sign === 1 ? this.axis_range.x_max - x_center : x_center - this.axis_range.x_min;
      console.log(`Offset ${x_offset} ${x_range}`);
      x = sign * (x_offset/x_range);
    }

    if (y === y_center)
    {
      y = 0;
    }
    else if (y === 0xFFFFFFFF)
    {
      y = undefined;
    }
    else
    {
      let sign = y > y_center ? -1: 1;
      let y_offset = sign === -1 ? y - y_center : y_center - y; 
      let y_range = sign === -1 ? this.axis_range.y_max - y_center : y_center - this.axis_range.y_min;
      console.log(`Offset ${y_offset} ${y_range}`);
      y = sign * (y_offset/y_center);
    }

    return [x, y, this.axis_range.x_min, this.axis_range.x_max, x_center, x_offset, x_range, this.axis_range.y_min, this.axis_range.y_max, y_center, y_offset, y_range];
  }

  _init() {
    noble.on('stateChange', (state) => {
      switch (state) {
        case 'poweredOn':
          this.poweredOn = true;
          let serviceUUIDs = [];
          let allowDuplicates = false;
          noble.startScanning(serviceUUIDs, allowDuplicates);  
          console.log('Bluetooth powered on starting to look for devices!');
          break;
        case 'poweredOff':
          this.poweredOff = true;
          break;
        default:
          // DO NOTHING
          break
      }
    });

    noble.on('discover', (peripheral) => {
      if (peripheral.advertisement.localName === 'raspberry' || peripheral.advertisement.localName === 'tvro2')
      {
        console.log(peripheral);
      }
      if (this.bluetoothDevices.findIndex((el, index, array)=> el.advertisement.localName === peripheral.advertisement.localName) !== -1)
      {
        return;
      }

      
      this.bluetoothDevices = [...this.bluetoothDevices, peripheral];
      this.emit('deviceDiscovered', this.bluetoothDevices);
    });
  }

  connectToDevice(peripheral) {
    console.log("Attempting to connect to peripheral...");
    this.deviceName = peripheral.advertisement.localName;

    peripheral.connect((err) => {
      if (err) 
      {
        console.log("Error:", err);
        return false;
      }

      console.log("Connected to device");

      peripheral.discoverServices([], (err, services) => {
        if (err) {
          console.log('Failed to discover services:', err);
          return false;
        }

        services.forEach((service) => {
          console.log('found service:', service.uuid);

          if (service.uuid === this.eyeTrackerServiceUUID)
          {
            console.log('Attempting to connect to service', service.uuid)
            service.discoverCharacteristics([], (err, characteristics) => {
              if (err) 
              {
                console.log('Failed to discover characteristics:', err);
                return false;
              }

              characteristics.forEach((characteristic) => {
                console.log('Found characteristic', characteristic.uuid);

                if (characteristic.uuid === this.eyeTrackerChrUUID) {
                  this.eyeTrackerChr = characteristic;

                  setInterval(() => {
                    this.eyeTrackerChr.read((error, data) => {
                      if (error) 
                      {
                        return;
                      }
                      let coordinates = this._parseData(data);
                      this.emit('eyepos', coordinates);
                    });
                  }, 200);

                }
              
              });
            });
          }
        });
      });
    });
  }
}

module.exports = Headset;

  var headset = new Headset();
  headset.on('deviceDiscovered', (deviceList) => {
    deviceList.forEach((device)=> {
      console.log(device.advertisement.localName);
      
      if (device.advertisement.localName === 'tvro1')
      {
        headset.connectToDevice(device);
      }
    });
  });

  headset.on('eyepos', (position) => {
    console.log('eye position change');
    console.log(JSON.stringify(position));
  });

/* DEMO CODE 
  Install Package: npm install noble@1.8.0 --save

  var headset = new Headset();
  headset.on('deviceDiscovered', (deviceList) => {
    deviceList.forEach((device)=> {
      console.log(device.advertisement.localName);
      
      if (device.advertisement.localName === 'tvro2')
      {
        headset.connectToDevice(device);
      }
    });
  });

  headset.on('eyepos', (position) => {
    console.log('eye position change');
    console.log(JSON.stringify(position));
  });
*/