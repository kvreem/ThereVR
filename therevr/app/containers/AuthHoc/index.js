/*
 *
 * AuthHoc
 * This is a higher order componnet used for auth and to render the sidebar and
 * topbar. It is also used to connect to the redux store. HOC stands for
 * higher order component.
 */

 /* eslint-disable */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { createStructuredSelector } from 'reselect';
import { selectUser, selectCurrentUser, selectRooms, selectContacts, selectContactsFakeStatus, makeSelectRoomWithContacts } from 'containers/AuthHoc/selectors'

import TopBar from 'components/TopBar';
import SideBar from 'components/SideBar';
import RoomsList from 'components/RoomsList';
import { connectSocket } from 'services/socket/index';
import { requestStatusChange, restoreState,
  fetchRooms, acceptCall, rejectCall, createRoom,
  fetchContacts
 } from './actions';

import styled from 'styled-components';

const LeftFrame = styled.div`
  position: fixed;
  top: 100px;
  bottom: 0;
  left: 0;
  width: 300px;
  overflow-y: scroll;
  background: #30414c;
  background: linear-gradient(to bottom right, #30414c, #1f303c);
`;

const RightFrame = styled.div`
  position: fixed;
  top: 100px;
  bottom: 0;
  left: 300px;
  right: 0;
  padding-right: 20px;
  padding-left: 20px;
  overflow-y: scroll;
`;

// This will be used for auth also
export default function MainHOC(WrappedComponent, hasBars) {

  class Main extends React.Component {
    constructor(props) {
      super(props)
    }

    handleInviteFriends = () => {
      FB.ui({
        method: "send",
        link: "http://google.com/", // Update URL
      });
    }

    updateProfilePic = () => {
      this.forceUpdate();
    }

    handleStatusChange = (status) => {
      const userId = this.props.currentUser.user_id;

      this.props.changeStatus(status, userId);
    }

    handleEndCall = () => {
      // const userId = this.props.user.currentUser.user_id;
      // const caller = this.props.user.calledBy.user_id;
      this.props.socket.emit('call:end', { userIds: [] });
    }

    componentWillMount() {
      // Check localstorage for a user
      // if (!this.props.user || this.props.user.currentUser === null) {
        this.props.restoreState();
      // }

      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        this.props.dispatch(push('/vr'));
      }

      this.props.fetchContacts();
      this.props.fetchRooms();
    }

    render() {
      if (!this.props.currentUser) {
        return <div>Loading ...</div>
      } else {
        return (
          <div className="container-fluid">
            <TopBar
              currentUser={this.props.currentUser}
              status={this.props.status}
              statusChange={this.handleStatusChange}
              {...this.props.user}
            />
              <LeftFrame>
                <RoomsList
                  rooms={this.props.rooms}
                  acceptCall={this.props.acceptCall}
                  rejectCall={this.props.rejectCall}
                  currentUser={this.props.currentUser}
                />
              </LeftFrame>

              <RightFrame>
                <WrappedComponent
                  updateProfilePic={this.updateProfilePic}
                  handleEndCall={this.handleEndCall}
                  {...this.props}
                />
              </RightFrame>
          </div>
        )
      }
    }
  }

  // const mapStateToProps = (state) => {
  //   console.log(state.toJS());
  //   return {
  //     user: state.toJS().user,
  //     rooms: state.toJS().rooms,
  //   }
  // }

  const mapStateToProps = createStructuredSelector({
    user: selectUser, // shouldn't be using this
    currentUser: selectCurrentUser,
    rooms: selectRooms,
    contacts: selectContactsFakeStatus//,
    // room: makeSelectRoomWithContacts()
  })

  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
      socket: connectSocket(dispatch),
      changeStatus: (status, userId) => dispatch(requestStatusChange(status, userId)),
      addRecentApi: (userId, recent) => dispatch(addRecentApi(userId, recent)),
      restoreState: () => dispatch(restoreState()),

      fetchRooms: () => dispatch(fetchRooms()),
      fetchContacts: () => dispatch(fetchContacts()),
      createRoom: (contact) => dispatch(createRoom(contact)),
      acceptCall: (room) => dispatch(acceptCall(room)),
      rejectCall: (room) => dispatch(rejectCall(room)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(Main);
}
