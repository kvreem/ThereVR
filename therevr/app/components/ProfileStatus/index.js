/**
*
* ProfileStatus
* Returns the status of the ProfilePic.
*/

import React from 'react';
import camera from 'images/profile/camera_icon.png';
import away from 'images/current/away.png';
import busy from 'images/current/busy.png';
import offline from 'images/current/offline.png';
import online from 'images/current/online.png';
import StatusChanger from 'components/StatusChanger';
const statusPicker = { away, offline, online, busy };
// import styled from 'styled-components';


function ProfileStatus(props) {
  const status = statusPicker[props.status];
  if (!props.isLoggedIn && props.isContact) {
    return (
      <StatusChanger
        statusImg={status}
        status={props.status}
        handleStatusChange={() => 'dummy'}
        style={{ zIndex: 9999 }}
      />
    );
  }

  if (props.ownProfile) {
    return (
      <span className="user-camera">
        <form id="imageForm" className="uploader" encType="multipart/form-data">
          <input onChange={props.handleProfileChange.bind(this)} type="file" name="file" className="upload-file" />
          <img className="center-camera" alt="icon" src={camera} />
        </form>
      </span>
    );
  }

  if (!props.isTopBar) {
    return (
      <span className="">
        <button aria-describedby="popover-trigger-focus" type="button" className="image-button btn btn-default">
          <img
            alt="Online symbol"
            src={status}
            className="set-status-image"
          />
        </button>
      </span>
    );
  }

  return (
    <StatusChanger
      statusImg={status}
      status={props.status}
      handleStatusChange={props.handleStatusChange}
      style={{ zIndex: 9999 }}
    />
  );
}

ProfileStatus.propTypes = {
  ownProfile: React.PropTypes.bool,
  status: React.PropTypes.string,
};

export default ProfileStatus;
