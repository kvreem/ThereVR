/**
*
* StatusChanger
*
*/

import React from 'react';
import { Col, Glyphicon, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import away from 'images/current/away.png';
import busy from 'images/current/busy.png';
import offline from 'images/current/offline.png';
import online from 'images/current/online.png';
// import styled from 'styled-components';
function checkStatus(check, against) {
  return check === against ? 'checked' : 'unChecked';
}

function StatusChanger(props) {
  const { status, handleStatusChange, statusImg } = props;
  const isOnline = checkStatus(status, 'online');
  const isOffline = checkStatus(status, 'offline');
  const isAway = checkStatus(status, 'away');
  const isBusy = checkStatus(status, 'busy');

  const popoverFocus = (
    <Popover onChange={handleStatusChange.bind(this)} id="popover-trigger-focus">
      <div>
        <Col xs={2}> <Glyphicon glyph="ok" className={isOnline} /></Col>
        <Col xs={10}>
          <a onClick={handleStatusChange.bind(this, 'online')} name="online" ><img alt="status" src={online} /> <span> Online </span> </a>
        </Col>
      </div>
      <div>
        <Col xs={2}> <Glyphicon glyph="ok" className={isOffline} /></Col>
        <Col xs={10}>
        <a onClick={handleStatusChange.bind(this, 'offline')} name="offline" ><img alt="status" src={offline} /> <span> Offline </span></a>
        </Col>
      </div>
      <div>
        <Col xs={2}> <Glyphicon glyph="ok" className={isAway} /></Col>
        <Col xs={10}>
        <a onClick={handleStatusChange.bind(this, 'away')} name="away"><img alt="status" src={away} /> <span> Away </span></a>
        </Col>
      </div>
      <div>
        <Col xs={2}> <Glyphicon glyph="ok" className={isBusy} /></Col>
        <Col xs={10}>
        <a onClick={handleStatusChange.bind(this, 'busy')} name="busy"><img alt="status" src={busy} /> <span> Do Not Disturb </span></a>
        </Col>
      </div>
    </Popover>
  );
  return (
    <OverlayTrigger trigger="focus" placement="bottom" overlay={popoverFocus}>
      <Button className="image-button">
        <img alt="current status" src={statusImg} className="set-status-image" />
      </Button>
    </OverlayTrigger>
  );
}

StatusChanger.propTypes = {

};

export default StatusChanger;
