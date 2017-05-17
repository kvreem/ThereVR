/**
*
* Rooms
*
*/

import React from 'react';

import { Link } from 'react-router';
// import styled from 'styled-components';
import Avatar from 'components/Avatar';
import styled from 'styled-components';

const StyledList = styled.ul`
  font-family: Raleway;

  padding: 0;

  a {
    text-decoration: none;
  }

  a:active {
    text-decoration: none;
  }
`

const StyledListItem = styled.li`
  transition: background 0.5s, color 0.5s;
  display: block;
  padding: 20px;
  color: ${props => props.callState == "Call Ended" ? "#778e9c" : "white"};
  background: ${props => props.callState == 'Calling' ? "#333" : props.callState == 'In Call' ? "#00aeef" : "transparent"};
  text-decoration: none;

  &:hover {
    background: ${props => props.callState == 'Calling' ? "#333" : props.callState == 'In Call' ? "#61c1e4" : "#3b5769"};
    color: ${props => props.callState == "Call Ended" ? "white" : "white"};
  }
`

const StyledUsername = styled.span`
  display: inline-block;
  margin-left: 20px;
  max-width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: -4px;
`;

const StyledHeader = styled.div`
  text-decoration: none;
  display: block;
  font-size: 20pt;
  font-weight: 400;
  margin-bottom: 10px;
  margin-left: 68px;
`

const StyledButton2 = styled.div`
  font-family: Raleway;
  border-radius: 20px;
`

class RoomsList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    console.log(this.props.rooms);
    return (
      <div style={{wordWrap: 'break-word', paddingLeft: 0, paddingRight: 0}}>
        {this.props.rooms.length == 0 ? <div style={{
          fontFamily: "Raleway",
          fontSize: "18pt",
          textAlign: "center",
          color: "rgb(200,210,220)",
          margin: "40px 10px"
        }}>
          No recent rooms.
        </div>: null}
      	<StyledList className="rooms-list">
          {this.props.rooms.map((room) => {
          const currentUser = room.users.filter((user) => user.data && user.data._id == this.props.currentUser._id)[0];
            return (
            <Link key={"room_list " + room._id} to={`/room/${room._id}`}>
              <StyledListItem callState={room.callState}>
                {room.callState == "In Call" ? <StyledHeader>{room.callState}</StyledHeader> : null }
                {
                  room.users.filter((user) => user.data && user.data._id != this.props.currentUser._id).map((user) => {
                    var userState = "N/A";

                    if (user.rejected) {
                      if (user.accepted) {
                        userState = "Closed";
                      } else {
                        userState = "Rejected";
                      }
                    } else if (user.active) {
                      userState = "Active";
                    } else {
                      userState = "Inactive";
                    }
                    return <span key={"room_list " + room._id + "_" + user.data._id}>
                      <Avatar user={user.data} active={user.active} />
                      <StyledUsername>{user.data.name}</StyledUsername>
                    </span>
                  })
                }
                {
                  (!room.inRoom && room.callState == "Calling") ? <div>
                    <br />
                    <StyledButton2 className="btn btn-primary" onClick={() => this.props.acceptCall( room )}>Join</StyledButton2>
                    &nbsp;
                    <StyledButton2 className="btn btn-danger" onClick={() => this.props.rejectCall( room )}>{currentUser.accepted ? "End" : "Reject"}</StyledButton2>
                  </div> : null
                }
              </StyledListItem>
            </Link>
            )
          })}
      	</StyledList>
      </div>
    );
  }
}

RoomsList.propTypes = {

};

export default RoomsList;
