import React from 'react';
import { shallow } from 'enzyme';

import ProfileAvatar from 'components/ProfileAvatar';
import ProfilePic from '../index';

describe('<ProfilePic />', () => {
  it('should return <ProfileAvatar />', () => {
    const renderedComponent = shallow(
      <ProfilePic />
    );

    expect(renderedComponent.contains(<ProfileAvatar />)).toEqual(false);
  });
});
