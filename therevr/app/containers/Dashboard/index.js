/*
 *
 * Dashboard
 * This the dashboard screen. This is seen immediatly after login.
 */

import React from 'react';
import { Link } from 'react-router';
import AuthHoc from 'containers/AuthHoc';
import Logo from 'components/Logo';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="text-center main-first-content">
        <div className="row main-page">
          <div className="p-40">
            <Logo container="home-logo-container" />
          </div>
          <div className="p-40-x-rf">
            <Link
              to={`/contacts/all/${this.props.currentUser.user_id}`}
              className="go-there-button"
            >
              <h3><span> <i><strong>Contacts!</strong></i></span></h3>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {

};

export default AuthHoc(Dashboard);
