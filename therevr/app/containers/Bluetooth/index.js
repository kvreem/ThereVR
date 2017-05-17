/*
 *
 * Profile
 * This is the profile page. /profile/:userId. If the :userId matches the
 * current user id it renders the invite and logout buttons.
 */

import React, { PropTypes } from 'react';
import AuthHoc from 'containers/AuthHoc';
import { Link } from 'react-router';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectCurrentProfile } from 'containers/AuthHoc/selectors'


/* eslint-disable */
export class Bluetooth extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props)
  {
    super(props);

    this._onDeviceSelect = this._onDeviceSelect.bind(this);
    this._onStartScan = this._onStartScan.bind(this);

    console.log("://////")
    console.log(window.blueDeviceList);

    if (window.onFoundBluetooth) {
      window.onFoundBluetooth((bluetooth) => {
        this.setState({
          bluetoothDevices: window.blueDeviceList || []
        })
      });
    }

    this.state = {
      bluetoothDevices: window.blueDeviceList || [],
      timeout: 0
    }
  }

  componentWillMount() {
      this.props.restoreState();

    this.props.fetchRooms();
  }

  render() {
    let {bluetoothDevices, timeout} = this.state;
    let devices = [<option key="None">None</option>];
    
    bluetoothDevices.forEach((device)=>{
      devices.push(<option key={device}>{device}</option>);
    });
    
    return (
      <div>
        <h1>Bluetooth List</h1>
        {/*<button className="btn btn-primary" type="button" onClick={this._onStartScan}>Scan for devices ({timeout})</button> */}
        <div className="form-group">
          <label>Select device:</label>
          <select className="form-control" id="selectDevice" onChange={this._onDeviceSelect}>
            {devices}
          </select>
        </div>
      </div>
    );
  }
  
  _onStartScan()
  {
    console.log("Start Bluetooth Scanning");

    let intervalId = setInterval(()=> {
      this.setState({
        timeout: this.state.timeout - 1
      })
    }, 1000);

    setTimeout(()=> { 
      console.log("Stop Bluetooth Scanning");
  
      // Stop procedure
      clearInterval(intervalId);
      this.setState({
        timeout: 0
      })
    }, 10000);

    this.setState({
      timeout: 10
    })
  }

  _onDeviceSelect(event)
  {
    console.log('select object', event);
    console.log("Device to connnect", event.target.value);
    if (window.connectBluetooth) {
      window.connectBluetooth(event.target.value);
    }
  }
}

Bluetooth.propTypes = {
  routeParams: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  currentProfile: selectCurrentProfile
})

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthHoc(Bluetooth));