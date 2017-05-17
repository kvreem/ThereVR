/**
*
* Logo
* Returns Logo
*/

import React from 'react';
import logo from 'images/logo.png';
// import styled from 'styled-components';


function Logo(props) {
  return (
    <img
      role="presentation"
      alt="THERE VR LOGO"
      src={logo}
      className={props.imgClass}
    />
  );
}

Logo.propTypes = {
  container: React.PropTypes.string,
};

export default Logo;
