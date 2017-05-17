/*
 *
 * Profile
 * This is the profile page. /profile/:userId. If the :userId matches the
 * current user id it renders the invite and logout buttons.
 */

import React, { PropTypes } from 'react';
import AuthHoc from 'containers/AuthHoc';
import Invite from 'components/Invite';
import ProfilePic from 'components/ProfilePic';
import Avatar from 'components/Avatar';
import { Link } from 'react-router';
// import { logout, requestStatusChange, uploadPicture } from 'containers/AuthHoc/actions';

import { createStructuredSelector } from 'reselect';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectUser, selectCurrentUser, selectRooms, selectContacts, makeSelectRoomWithContacts, selectCurrentProfile } from 'containers/AuthHoc/selectors'
import { logout, requestStatusChange, uploadPicture, restoreState,
  fetchRooms, acceptCall, rejectCall, createRoom
 } from 'containers/AuthHoc/actions';

 import styled from 'styled-components';

 const StyledProfile = styled.div`
  font-family: Raleway;
  .avatar {
    text-align: center;
  }
  padding-top: 50px;
 `

 const StyledButton = styled.div`
  border-radius: 20px;
 `

/* eslint-disable */
export class Profile extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    // Check localstorage for a user
    // if (!this.props.user || this.props.user.currentUser === null) {
      this.props.restoreState();
    // }

    this.props.fetchRooms();
  }

  handleLogout = () => {
    this.props.dispatch(requestStatusChange('offline', this.props.currentUser.user_id));
    this.props.dispatch(logout());
    // localStorage.setItem('currentUser', JSON.stringify({
    //   status: "offline"
    // }));
  }

  handleInviteFriends = () => {
    window.FB.ui({
      method: 'send',
      link: 'http://google.com/', // Update URL
    });
  }

  handleProfileChange = (event) => {
    const { dispatch } = this.props;
    const update = this.props.updateProfilePic;
    const { files } = event.target;
    const reader = new FileReader();

    console.log(this.props.currentUser);

    reader.onload = (frEvent) => {
      dispatch(uploadPicture(frEvent, this.props.currentUser, files, update));
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  handleProfileClick = () => {
    $(this.fileChanger).trigger("click")
  }

  createRoom(event) {
    const currentUser = this.props.currentUser;
    // const profileUser = currentUser.friendObj.filter((item) => {
    //   if (item.user_id === this.props.routeParams.userId) return item;
    // })[0];
    const profileUser = this.props.currentProfile;

    this.props.createRoom(profileUser);
  }

  // terrible, terrible code.
  email() {
    const user = this.props.currentProfile;

    if (!user.email) return;

    var emailMatch = user.email.match(/(.).*@(.).*/);
    return emailMatch[1] + "...@" + emailMatch[2] + "..."
  }

  render() {
    const currentUser = this.props.currentUser;

    const isThisUser = this.props.routeParams.userId == currentUser.user_id;
    
    const user = this.props.currentProfile;
    
    if (!currentUser || !this.props.currentProfile) {
      return <div>Loading...</div>
    }

    return (
      <StyledProfile className="row p-5-x-rf-per profile-content">
        <div className="avatar col-xs-12 col-md-5">
          <Avatar user={user} large handleProfileChange={isThisUser ? this.handleProfileClick.bind(this) : null}/>
          <span className="user-camera" style={{display: "none"}}>
            <form id="imageForm" className="uploader" encType="multipart/form-data">
              <input ref={(fileChanger) => this.fileChanger = fileChanger} onChange={this.handleProfileChange.bind(this)} type="file" name="file" className="upload-file" />
            </form>
          </span>
        </div>
        <div className="col-xs-12 col-md-7">
          <br />
          <div className="row">
            <div className="col-xs-3">
              <strong>Name</strong>
            </div>
            <div className="col-xs-7">
              {user.name}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3">
              <strong>Email</strong>
            </div>
            <div className="col-xs-7">
              {this.email()}
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-xs-12">
              {
                isThisUser ?
                  <StyledButton className="btn btn-primary" onClick={this.handleLogout.bind(this)}>Logout</StyledButton>
                :
                  <StyledButton className="btn btn-primary" onClick={this.createRoom.bind(this)}>Call</StyledButton>
              }
              {
                isThisUser ?
                  <div style={{marginTop: 10}}>
                    <Link to="/bluetooth"><StyledButton className="btn btn-info">Bluetooth</StyledButton></Link>
                  </div>
                :
                  null
              }
            </div>
          </div>
        </div>

        {/*
        <div className="col-xs-5 right-black-line p-t-2">
          <ProfilePic
            size="fluid"
            ownProfile
            user={user}
            isLoggedIn={isThisUser}
            isContact
            handleProfileChange={this.handleProfileChange}
          />
        </div>
        <div className="col-xs-7" style={{wordWrap: 'break-word'}}>
          <div className="row">
            <div className="col-xs-3">
              <h4>Name</h4>
            </div>
            <div className="col-xs-9">
              <h4>{user.name}</h4>
            </div>

          </div>
          <div className="row p-10-x-rf">
            <div className="col-xs-3">
              <h4>Email </h4>
            </div>
            <div className="col-xs-9">
              <h4>{user.email}</h4>
            </div>
          </div>
          <hr /> 
          <div className="row">
            <div className="col-xs-12">
              <div className="btn btn-primary" onClick={this.createRoom.bind(this)}>Call</div>
            </div>
          </div>
        { user.location ?
          <div className="row p-10-x-rf">
            <div className="col-xs-offset-1 col-xs-5">
              <h4>Location</h4>
            </div>

              <div className="col-sm-6">
                <h4>{user.location.name}</h4>
              </div>
              </div> : null
            }


          {
            this.props.routeParams.userId === currentUser.user_id ?
              <Invite
                handleLogout={this.handleLogout}
                handleInviteFriends={this.handleInviteFriends}
              /> : null
          }
        </div>*/}
      </StyledProfile>
    );
  }
}

Profile.propTypes = {
  routeParams: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  currentProfile: selectCurrentProfile
//   user: selectUser, // shouldn't be using this
//   currentUser: selectCurrentUser,
//   rooms: selectRooms,
//   contacts: selectContacts,
//   room: makeSelectRoomWithContacts()
})

function mapDispatchToProps(dispatch) {
  return {
//     dispatch,
//     // socket: connectSocket(dispatch),
//     changeStatus: (status, userId) => dispatch(requestStatusChange(status, userId)),
//     addRecentApi: (userId, recent) => dispatch(addRecentApi(userId, recent)),
//     restoreState: () => dispatch(restoreState()),

//     fetchRooms: () => dispatch(fetchRooms()),
//     createRoom: (contact) => dispatch(createRoom(contact)),
//     acceptCall: (room) => dispatch(acceptCall(room)),
//     rejectCall: (room) => dispatch(rejectCall(room)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthHoc(Profile));
// export default AuthHoc(Profile);