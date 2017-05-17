/**
*
* Avatar
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const StyledAvatar = styled.div`
  .overlay {
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    .overlay {
      cursor: pointer;
      display: block;
      opacity: ${(props) => props.handleProfileChange ? 0.7 : 0};
    }
  }

  .glyphicon-camera {
    color: white;
    font-size: 34pt;
    top: 77px;
  }
`

class Avatar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  onClick() {
    if (this.props.handleProfileChange) this.props.handleProfileChange();
  }

  componentDidMount() {
    if (this.props.popover)
      $(ReactDOM.findDOMNode(this)).popover({trigger: "hover", content: this.props.user.name, placement: "right"})
    console.log(this.root);
  }

  render() {
    const user = this.props.user;

    var size = 50;
    var borderSize = 0;
    var borderColor = "rgb(0,255,20)";

    if (this.props.medium) {
      size = 60;
    }

    if (this.props.large) {
      size = 200;
    }

    if (this.props.active) {
      borderSize = 2;
      size -= borderSize;
    }

    return (
      <StyledAvatar ref={(root) => this.root = root} onClick={this.onClick.bind(this)} handleProfileChange={this.props.handleProfileChange} style={{
        position: "relative",
        display: 'inline-block',
        width: size + "px",
        height: size + "px",
        borderRadius: (size / 2) + "px",
        border: borderSize + "px solid " + borderColor,
        overflow: 'hidden',
        verticalAlign: 'middle'
      }}>
        <div style={{
          width: size + "px",
          height: size + "px",
          backgroundImage: `url(https://graph.facebook.com/${user.user_id}/picture?type=large)`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}>
        </div>
        <div className="overlay" style={{
          background: "black",
          position: "absolute",
          top: "0",
          left: "0",
          width: size + "px",
          height: size + "px",
        }}>
          <span className="glyphicon glyphicon-camera"></span>
        </div>
      </StyledAvatar>
    );
  }
}

Avatar.propTypes = {

};

export default Avatar;
