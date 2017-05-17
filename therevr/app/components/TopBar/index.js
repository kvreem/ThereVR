/**
*
* TopBar
* The main header of the page.
*/

import React from 'react';
import Logo from 'components/Logo';
import { Link } from 'react-router';
import contacts from 'images/profile/contacts.png';
import ProfilePic from 'components/ProfilePic';
import Avatar from 'components/Avatar';
import styled from 'styled-components';

const CenterLogoStyled = styled.div`
  text-align: center;

  img {
    height: 50px;
    vertical-align: center;
  }
`;

const StyledTopBar = styled.div`
  padding: 20px;
  height: 100px;

  box-shadow: 0px -20px 50px black;

  a {
    text-decoration: none;
  }

  a:active {
    text-decoration: none;
  }

`

const StyledName = styled.span`
  font-family: Raleway;
  font-weight: 100;
  color: black;
  margin-left: 20px;
  font-size: 18pt;
  vertical-align: -3px;
`;

function TopBar(props) {
  const { currentUser } = props;
  const profileRoute = `/profile/${currentUser.user_id}`;
  const homeRoute = `/home`;
  const contactRoute = `/contacts/all/${currentUser.user_id}`;

  return (
    <StyledTopBar className="row">
      <div className="col-sm-5  col-xs-4">
        <Link to={profileRoute}>
          <Avatar user={currentUser} medium/>
          <StyledName>{(currentUser.name || "").split(" ")[0]}</StyledName>
        </Link>
        {/*
        <ProfilePic
          link={profileRoute}
          hasName
          user={currentUser}
          name="Current User"
          handleStatusChange={props.statusChange}
          isTopBar
        />*/}
      </div>

      <div className="col-sm-2 col-xs-4">
        <Link to={homeRoute}>
          <CenterLogoStyled>
            <Logo />
          </CenterLogoStyled>
        </Link>
      </div>

      <div className="col-sm-5 col-xs-4 text-right">
        <div className="col-sm-9 col-xs-12">
        </div>
        <div className="col-sm-3 col-xs-12">
          <Link to={contactRoute}>
            <img role="presentation" src={contacts} height="50px" />
          </Link>
        </div>
      </div>
    </StyledTopBar>
  );
}

TopBar.propTypes = {

};

export default TopBar;
