import React from 'react';
import { shallow } from 'enzyme';

import Invite from '../index';

describe('<Invite />', () => {
  let renderedComponent;
  const handleClick = () => 'hello';
  beforeEach(() => {
    renderedComponent = shallow(
      <Invite
        handleLogout={handleClick.bind(this)}
        handleInviteFriends={handleClick.bind(this)}
      />
    );
  });

  it('Should render a logout link', () => {
    const logout = (<h4> <span> Logout </span> </h4>);

    expect(renderedComponent.contains(logout)).toEqual(true);
  });

  it('Should rednder a invite friends link', () => {
    const invite = (
      <a className="invite-friend-button">
        <span> Invite Friends </span>
      </a>
    );

    expect(renderedComponent.contains(invite)).toEqual(false);
  });

  it('Should rednder slogan', () => {
    const slogan = (
      <span className="blueColor">Love There Conferencing </span>
    );

    expect(renderedComponent.contains(slogan)).toEqual(false);
  });
});
