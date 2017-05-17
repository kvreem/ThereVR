/**
*
* ProfilePic
* Returns a profile pic.
*/

import React from 'react';
import ProfileAvatar from 'components/ProfileAvatar';

function ProfilePic(props) {
  return (
    <div onClick={props.handleClick ? props.handleClick.bind(this, props.user.user_id) : null} className="">
      <div className="text-center">
        <ProfileAvatar
          size={props.size}
          picture={props.user ? props.user.profile_picture : ''}
          status={props.user ? props.user.status : ''}
          ownProfile={props.ownProfile}
          hasName={props.hasName}
          name={props.user ? props.user.name : 'hello'}
          link={props.link ? props.link : null}
          handleStatusChange={props.handleStatusChange}
          isTopBar={props.isTopBar}
          isLoggedIn={props.isLoggedIn}
          isContact={props.isContact}
          handleProfileChange={props.handleProfileChange}
        />
      </div>
    </div>
  );
}

ProfilePic.propTypes = {
  size: React.PropTypes.string,
  ownProfile: React.PropTypes.bool,
  name: React.PropTypes.string,
};

export default ProfilePic;
