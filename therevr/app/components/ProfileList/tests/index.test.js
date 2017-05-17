import React from 'react';
import { shallow } from 'enzyme';

import ProfilePic from 'components/ProfilePic';
import ProfileList from '../index';

describe('<ProfileList />', () => {
  it('renders based on props', () => {
    const renderedComponent = shallow(
      <ProfileList list={['', '', '']} />
    );
    const profileComponent = (
      <ProfilePic />
    );

    expect(renderedComponent.contains(profileComponent)).toEqual(false);
  });
});
