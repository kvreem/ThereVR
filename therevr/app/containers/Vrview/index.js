/*
 *
 * Vrview
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import makeSelectVrview from './selectors';
import { selectCurrentUser, selectCurrentRoom } from 'containers/AuthHoc/selectors';
import { restoreState, fetchContacts, fetchRooms } from 'containers/AuthHoc/actions.js';
import RoomsStream from 'rooms-stream';

export class Vrview extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.props.restoreState();
    this.props.fetchContacts();
    this.props.fetchRooms();
  }

  render() {
    console.log(this.props.currentRoom);
    if (this.props.currentUser && this.props.currentRoom) {
      return (
        <div>
          <Helmet
            title="Vrview"
            meta={[
              { name: 'description', content: 'Description of Vrview' },
            ]}
          />
          Hey!
          {this.props.currentUser.user_id}
          <RoomsStream currentUser={this.props.currentUser} room={this.props.currentRoom} roomId={this.props.currentRoom._id} canvasHidden />
        </div>
      );
    } else {
      return (
        <div>
          Loading..
        </div>
      )
    }
  }
}

Vrview.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // VRView: makeSelectVrview(),
  currentUser: selectCurrentUser,
  currentRoom: selectCurrentRoom
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    restoreState: () => dispatch(restoreState()),
    fetchContacts: () => dispatch(fetchContacts()),
    fetchRooms: () => dispatch(fetchRooms())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Vrview);
