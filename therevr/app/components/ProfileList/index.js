/**
*
* ProfileList
* Returns a list of ProfilePics.
*/

import React from 'react';
import ProfilePic from 'components/ProfilePic';
import Avatar from 'components/Avatar';
import { Link } from 'react-router';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  margin-top: 20px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  align-content: space-around;
  text-align: center;
  margin-top: 20px;
  margin-left: -10px;

`;

function ProfileList(props) {
  let style = {};
  if (props.size === 'medium') {
    style = { margin: '30px', width: '33.33%' };
  }

  const list = props.list.map((item, index) => (
    <ProfileContainer style={style} key={index}>
      <Link to={`/profile/${item.user_id}`}>
      <Avatar user={item} large />
      {/*
        <ProfilePic
          size={props.size}
          user={item}
          hasName={props.hasName}
          handleClick={props.handleClick ? props.handleClick : null}
        />
      */}
      <h4 style={{fontFamily: "Raleway"}}>{item.name}</h4>
      </Link>
      { props.calledBy ? props.calledBy.user_id === item.user_id ?
      <ButtonContainer>
        <Link to={`/profile/${item.user_id}`}>
        <span className="button-pulse pulse">
          <a className="btn btn-info btn-xs">
            <span className="glyphicon glyphicon-earphone"></span> Go There!
          </a>
        </span>
        </Link>
        <span onClick={props.handleEndCall.bind(this)} style={{ marginTop: '10px' }} className="">
          <a style={{ color: 'red' }} className="btn btn-warn btn-xs">
            <span className="glyphicon glyphicon-earphone"></span> Decline
          </a>
        </span>
      </ButtonContainer>
      : null : null}
    </ProfileContainer>
  ));

  if (props.size !== 'medium') {
    return (
      <div>
        {list}
      </div>
    );
  }

  return (
    <ListContainer>
      {list}
    </ListContainer>
  );
}

ProfileList.propTypes = {
  list: React.PropTypes.array,
};

export default ProfileList;
