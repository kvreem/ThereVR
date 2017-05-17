/**
*
* ProfileAvatar
* Retuns the avatar of the profile. The picture and the status.
*/

import React from 'react';
import { Link } from 'react-router';
import ProfileStatus from 'components/ProfileStatus';
import ProfileName from 'components/ProfileName';
import { Div, Container } from './styles';
const SMALL = 'small';
const BIG = 'big';
const MEDIUM = 'medium';
const FLUID = 'fluid';

function ProfileAvatar(props) {
  const { picture, status, size, ownProfile,
    name, link, handleStatusChange, isTopBar } = props;

  let MainContainer = Container;
  let dimensions = { width: 68, height: 68 };

  if (size === SMALL) dimensions = { width: 50, height: 50 };
  if (size === BIG) dimensions = { width: 300, height: 300 };
  if (size === MEDIUM) dimensions = { width: 150, height: 150 };
  if (size === FLUID) dimensions = { width: '100%', height: 'auto' };
  if (!name) MainContainer = Div;

  return (
    <MainContainer className="avatar-div">
      <Link to={link}>
        <img
          alt="Profile Pic"
          className="avatar-image"
          width={dimensions.width}
          height={dimensions.height}
          src={picture}
        />
      </Link>
      <ProfileStatus
        handleStatusChange={handleStatusChange}
        status={status}
        ownProfile={ownProfile}
        isTopBar={isTopBar}
        isLoggedIn={props.isLoggedIn}
        isContact={props.isContact}
        handleProfileChange={props.handleProfileChange}
      />
      <ProfileName {...props} />
    </MainContainer>
  );
}

ProfileAvatar.propTypes = {
  picture: React.PropTypes.string,
  status: React.PropTypes.string,
  size: React.PropTypes.string,
  ownProfile: React.PropTypes.bool,
  name: React.PropTypes.string,
};

export default ProfileAvatar;
