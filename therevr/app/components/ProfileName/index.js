/**
*
* ProfileName
*
*/

import React from 'react';
import { Container, MediumContainer } from './styles';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function ProfileName(props) {
  const { name, hasName, status, size } = props;
  if (!name) return null;
  if (!hasName) return null;

  if (size === 'medium') {
    return (
      <MediumContainer>
        <h4><strong>{name}</strong>
        </h4><p><i>{capitalizeFirstLetter(status)}</i></p>
      </MediumContainer>
    );
  }

  return (
    <Container className="">
      <h4><strong>{name}</strong>
      </h4><p><i>{capitalizeFirstLetter(status)}</i></p>
    </Container>
  );
}

ProfileName.propTypes = {
  name: React.PropTypes.string,
};

export default ProfileName;
