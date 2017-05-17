/**
*
* Invite
* Returns the logout and invite button on main profile page.
*/

import React from 'react';
import { Link } from 'react-router';
// import styled from 'styled-components';


function Invite(props) {
  return (
    <div>
      <div className="row p-40-x-rf">
        <div className="col-sm-offset-1 col-sm-5">
          <Link to="/welcome" onClick={props.handleLogout.bind(this)} className="log-out-button">
            <h4> <span> Logout </span> </h4>
          </Link>
        </div>
        <div className="col-sm-6">
        </div>
      </div>
      <div className="row p-40-x-rf"></div>
      <div className="row p-10-x-rf"></div>
      <div className="row">
        <div className="col-sm-5">
        </div>
        <div className="col-sm-7">
          <span className="blueColor">Love There Conferencing? </span>
          <span>
            <a
              style={{ cursor: 'pointer' }}
              onClick={props.handleInviteFriends.bind(this)}
              className="invite-friend-button"
            >
              <span> Invite Friends </span>
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

Invite.propTypes = {

};

export default Invite;
