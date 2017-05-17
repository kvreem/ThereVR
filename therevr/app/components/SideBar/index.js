/**
*
* SideBar
* The sidebar of the page.
*/

import React from 'react';
import ProfileList from 'components/ProfileList';
import { LeftContainer } from './styles';

function SideBar(props) {
  const { contactList, currentId, handleInviteFriends,
    beingCalled, calledBy, handleEndCall } = props;

  return (
    <LeftContainer>
      <div>
        { contactList.length > 0 ?
        <div>
          <ProfileList
            currenId={currentId}
            list={contactList}
            hasName={false}
            beingCalled={beingCalled}
            calledBy={calledBy}
            handleEndCall={handleEndCall}
          />
        <div>{beingCalled ? <a className="btn btn-info btn-sm pulse-button">
          <span className="glyphicon glyphicon-earphone"></span> Go There!
        </a> : null}</div>
        </div> :
          <div style={{ padding: '0', cursor: 'pointer', margin: '25px 0 0 -25px', fonSize: '5px' }}>
            <span onClick={handleInviteFriends.bind(this)}>
              <a
                className="btn btn-info btn-sm pulse-button"
              >
                <span> Invite Friends </span>
              </a>
            </span>
          </div>
      }
      </div>
    </LeftContainer>
  );
}

SideBar.propTypes = {

};

export default SideBar;
