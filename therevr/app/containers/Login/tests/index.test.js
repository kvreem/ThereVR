import React from 'react';
import { shallow } from 'enzyme';
// import { FacebookLogin } from 'react-facebook-login-component';

import Logo from 'components/Logo';
import { Footer } from 'components/Footer';
import { Login } from '../index';

describe('<Login />', () => {
  let renderedComponent;

  beforeEach(() => {
    renderedComponent = shallow(
      <Login />
    );
  });

  it('Should render the Footer', () => {
    const footer = (<Footer />);

    expect(renderedComponent.contains(footer)).toEqual(true);
  });

  it('Should render the logo', () => {
    const logo = (<Logo container="logo" />);

    expect(renderedComponent.contains(logo)).toEqual(true);
  });

  it('Should render Facebook button', () => {
    expect(renderedComponent.contains(<div className="row facebookContainer"></div>)).toEqual(false);
  });
});
