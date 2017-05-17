/*
 *
 * Call
 * This is the call screen. /:currentUserId/call/:callToUserId. :callToUserId
 * Will be used to get the profile information of the user to be called.
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import AuthHoc from 'containers/AuthHoc';
import Logo from 'components/Logo';
import ProfilePic from 'components/ProfilePic';
import { getCallUser } from 'containers/AuthHoc/actions';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  padding: 20px 0 0 200px;
`;


export class Call extends React.Component { // eslint-disable-line react/prefer-stateless-function

  handleGoThere = (event) => {
    const { socket } = this.props;
    event.preventDefault();
    // console.log(this.props);
    socket.emit('call:beingPlaced', { calling: this.props.routeParams.contactUser, caller: this.props.user.currentUser.user_id });
    // dispatch(callUser(user.user_id));
  }

  render() {
    const { dispatch } = this.props;
    const { contactUser } = this.props.routeParams;
    dispatch(getCallUser(contactUser));

    const { callingFriend, user_id, beingCalled, calling } = this.props.user;
    const isBeingCalledStyle = beingCalled ? { background: 'tomato' } : {};
    const isCalling = 'Calling...';

    return (
      <div>
        <ProfileContainer>
          <Link to={`/profile/${this.props.routeParams.contactUser}`}>
            <ProfilePic
              currentId={this.props.currentUser.user_id}
              name="User To Call"
              user={callingFriend}
              hasName
            />
        </Link>
        </ProfileContainer>
        <div className="text-center">
          <div className="row main-page">
            <div className="p-40">
              <Logo container="home-logo-container" />
            </div>
            <div className="p-40-x-rf">
              <a onClick={this.handleGoThere} href="" className="go-there-button">
                <h3><span style={isBeingCalledStyle}>{calling ? isCalling : <span>Go <i><strong>There!</strong></i></span>}</span></h3>
              </a>
              <div style={{ paddingTop: '50px' }}>
              { calling ?
                <a onClick={this.props.handleEndCall.bind(this)} className="go-end-button">
                  <h3><span><span>End Call</span></span></h3>
                </a> : null
              }
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Call.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default AuthHoc(Call);
