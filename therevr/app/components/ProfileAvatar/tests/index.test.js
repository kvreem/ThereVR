import React from 'react';
import { shallow } from 'enzyme';

import ProfileAvatar from '../index';

describe('<ProfileAvatar />', () => {
  it('renders proper image', () => {
    const pic = 'randomurl';
    const renderedComponent = shallow(
      <ProfileAvatar picture={pic} />
    );
    const img = (
      <img
        alt="Profile Pic"
        className="avatar-image"
        width={68}
        height={68}
        src={pic}
      />
    );

    expect(renderedComponent.contains(img)).toEqual(true);
  });

  it('renders proper image size', () => {
    const pic = 'randomurl';
    const renderedComponent = shallow(
      <ProfileAvatar size="small" picture={pic} />
    );
    const img = (
      <img
        alt="Profile Pic"
        className="avatar-image"
        width={50}
        height={50}
        src={pic}
      />
    );

    expect(renderedComponent.contains(img)).toEqual(true);
  });
});
