import React from 'react';
import { shallow } from 'enzyme';

import logo from 'images/logo.png';
import Logo from 'components/Logo';

describe('<Logo />', () => {
  let renderedComponent;

  beforeEach(() => {
    renderedComponent = shallow(
      <Logo />
    );
  });

  it('Should render logo img', () => {
    const imgTag = (
      <img
        role="presentation"
        alt="THERE VR LOGO"
        src={logo}
      />
    );

    expect(renderedComponent.contains(imgTag)).toEqual(true);
  });
});
