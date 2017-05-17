/*
 *
 * Contacts
 * This is the main contact screen. /contacts/:selected/:userId. Depending on
 * :selected it will render the proper contacts between online or all.
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import AuthHoc from 'containers/AuthHoc';
import ProfileList from 'components/ProfileList';
import { updateRecent, addRecentApi } from 'containers/AuthHoc/actions';
import { ALL, ONLINE } from './constants';
import { Container, ContactContainer } from './styles';

export class Contacts extends React.Component { // eslint-disable-line react/prefer-stateless-function

  handleContactClick = (userId) => {
    const { dispatch } = this.props;
    const { user_id, recent } = this.props.currentUser;

    // dispatch(updateRecent(userId));
    dispatch(addRecentApi(user_id, recent));
  }

  render() {
    console.log(this);
    // Selected used to highlight button
    const { selected } = this.props.routeParams;
    const currentUser = this.props.currentUser;
    const list = selected === ALL ?
      this.props.contacts : currentUser.onlineFriends;

    return (
      <div>
        <Container className="all-online-content">
          <div className="contacts-bar-content">
            <Link
              to={`/contacts/all/${currentUser.user_id}`}
              className={selected === ALL ? 'selectAll' : ''}
            > All
          </Link>
          </div>
          <div className="contacts-bar-content">
            <Link
              to={`/contacts/online/${currentUser.user_id}`}
              className={selected === ONLINE ? 'selectAll' : ''}
            > Online
            </Link>
          </div>
        </Container>
        <ContactContainer>
          <ProfileList
            size="medium"
            list={list}
            hasName
            handleClick={this.handleContactClick}
            currenId={currentUser.user_id}
          />
        </ContactContainer>
      </div>
    );
  }
}

Contacts.propTypes = {
  routeParams: PropTypes.object.isRequired,
};

export default AuthHoc(Contacts);
