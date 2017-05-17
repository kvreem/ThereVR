/**
*
* Footer
* Returns the footer of the page
*/

/* eslint-disable */
import React from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';


const contactEmail = 'contact@therevr.com';

export default class Footer extends React.PureComponent {

  state = {
    isShowingModal: false,
  }

  handleClick = () => this.setState({isShowingModal: true})
  handleClose = () => this.setState({isShowingModal: false})

  render () {
    return (
      <div className="text-center footerCon">

        {
          this.state.isShowingModal &&
          <ModalContainer onClose={this.handleClose}>
            <ModalDialog onClose={this.handleClose}>
              <h1>About Us</h1>
              <p>Some about information here</p>
            </ModalDialog>
          </ModalContainer>
        }

        <div className="row footerLink">
          <div className="col-xs-offset-2 col-xs-2">
            <a className="point" onClick={this.handleClick}><h5>About</h5></a>
          </div>
          <div className="col-xs-2">
            <a href="/privacy"><h5>Privacy Policy</h5></a>
          </div>
          <div className="col-xs-2">
            <a href="/terms"><h5>Terms of Service</h5></a>
          </div>
          <div className="col-xs-2">
            <a href={`mailto:${contactEmail}`}><h5>Contact Us</h5></a>
          </div>
        </div>
        <div className="row footerLogo">
          <h5><span className="glyphicon glyphicon-copyright-mark"></span> <strong>There</strong>VR <small>2016</small></h5>
        </div>
      </div>
    );
  }
}
