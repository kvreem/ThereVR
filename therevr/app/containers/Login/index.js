/*
 *
 * Login
 * Logs the user in. The first page to be shown. /welcome or /.
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Footer from 'components/Footer';
import Logo from 'components/Logo';
import { loginAttempt } from 'containers/AuthHoc/actions';
import { FacebookLogin } from 'react-facebook-login-component';
import { push } from 'react-router-redux'


import { restoreState } from 'containers/AuthHoc/actions';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.restoreState();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user && typeof this.props.user.user_id != "undefined") {
      this.props.push('/home');
    }
  }

  // Handles the facebook response
  handleFacebook = (response) => {
    this.props.login(response);
  }

  render() {
    return (
      <div className="text-center loginContainer">
        <div className="row">
          <Logo container="logo" />
          <div className="logoName">
            <h3>
              <em><strong> There </strong> </em>
              Conferencing
            </h3>
            <p>
              a new way to meet
            </p>
          </div>
        </div>    
        <div className="row facebookContainer">
        {
          window.hookElectronApp ? <div onClick={() => window.clickFacebookButton(this.handleFacebook)}>Login with FB</div> :
          <FacebookLogin
            socialId={env == 'development' ? '1804049209848108' : '1721749814744715'}
            fields="name,email,picture, birthday,friends, location"
            scope="user_friends,public_profile,email,user_location,read_custom_friendlists"
            responseHandler={this.handleFacebook}
            buttonText=""
            version="v2.5"
            class="my-facebook-button-class"
            xfbml
          />
        }
        </div>
        <Footer />
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

/* eslint-disable */
const mapStateToProps = (state) => {
  console.log(state.toJS());
  return {
    user: state.toJS().user.currentUser,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    login: (userInfo) => dispatch(loginAttempt(userInfo)),
    restoreState: () => dispatch(restoreState()),
    push: (route) => dispatch(push(route))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
