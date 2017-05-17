import React from 'react';
import { shallow } from 'enzyme';

import ProfileName from '../index';
import { Container } from '../styles';

describe('<ProfileName />', () => {
  it('should return null if name is not present', () => {
    const renderedComponent = shallow(
      <ProfileName />
    );

    expect(renderedComponent.contains(<ProfileName />)).toEqual(false);
  });

  it('should render proper name and status', () => {
    const nameText = 'Test Name';
    const statusText = 'Online';

    const renderedComponent = shallow(
      <ProfileName name={nameText} status={statusText} />
    );

    const status = (
      <Container className="">
        <h4><strong>{name}</strong>
        </h4><p><i>{status}</i></p>
      </Container>
    );

    expect(renderedComponent.contains(status)).toEqual(false);
  });
});
