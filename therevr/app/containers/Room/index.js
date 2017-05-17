/*
 *
 * Room
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { createStructuredSelector } from 'reselect';
import makeSelectRoom from './selectors';
import { makeSelectRoomWithContacts } from 'containers/AuthHoc/selectors'
import RoomsStream from 'rooms-stream';
import styled from 'styled-components';

import Avatar from 'components/Avatar';

import AuthHoc from 'containers/AuthHoc';

const BottomBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  text-align: center;
`

const StyledButton = styled.div`
  font-family: Raleway;
  border-radius: 40px;
  font-size: 20pt;
  padding: 10px 20px;
  box-shadow: 3px 3px 0px rgba(0,0,0,0.2);
  text-align: -10px;

  .glyphicon {
    vertical-align: -1px;
  }
`

const StyledButton2 = styled.div`
  font-family: Raleway;
  border-radius: 20px;
`

export class Room extends React.Component { // eslint-disable-line react/prefer-stateless-function
  callBack() {
    var profileUser = this.props.room.users.filter((user) => user.data._id != this.props.currentUser._id)[0];
    if (profileUser)
      this.props.createRoom(profileUser.data);
  }

  render() {
    const room = this.props.room;

    if (room) {

      if (room.callState == "In Call") {
        return <div>
          <Helmet
            title="Room"
            meta={[
              { name: 'description', content: 'Description of Room' },
            ]}
          />
          <RoomsStream currentUser={this.props.currentUser} room={room} roomId={room._id} />
          <BottomBar>
            {
              room.users.map((user) => <span key={user.data.user_id} style={{marginRight: "20px"}}><Link to={`/profile/${user.data.user_id}`}><Avatar user={user.data} active={user.active} /></Link></span>)
            }
            <StyledButton className="btn btn-danger" onClick={() => this.props.rejectCall( room )}><span className="glyphicon glyphicon-earphone" />&nbsp;&nbsp;End Call</StyledButton>
          </BottomBar>
        </div>
      }

      return (
        <div>
          <Helmet
            title="Room"
            meta={[
              { name: 'description', content: 'Description of Room' },
            ]}
          />

          <h1>{room.callState}</h1>
          {
            room.users.map((user) => <span key={user.data.user_id} style={{marginRight: "20px"}}><Link to={`/profile/${user.data.user_id}`}><Avatar user={user.data} medium active={user.active} popover /></Link></span>)
          }
          <hr />

          {
            (!room.inRoom && room.callState == "Calling") ? <div>
              <StyledButton2 className="btn btn-primary" onClick={() => this.props.acceptCall( room )}>Join</StyledButton2>
              &nbsp;
              <StyledButton2 className="btn btn-danger" onClick={() => this.props.rejectCall( room )}>Reject</StyledButton2>
            </div> : room.callState != "Calling" ? <StyledButton2 className="btn btn-primary" onClick={this.callBack.bind(this)}>Call Back</StyledButton2> : null
          }

        </div>
      );
    } else {
      return <div>Loading ... </div>
    }
  }
}

Room.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // Room: makeSelectRoom(),
  room: makeSelectRoomWithContacts()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

// export default connect(mapStateToProps, mapDispatchToProps)(Room);

export default AuthHoc(connect(mapStateToProps, mapDispatchToProps)(Room));
