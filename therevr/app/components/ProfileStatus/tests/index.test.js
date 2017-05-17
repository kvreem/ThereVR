import React from 'react';
import { shallow } from 'enzyme';

import camera from 'images/profile/camera_icon.png';
import ProfileStatus from '../index';

describe('<ProfileStatus />', () => {
  const handleProfileChange = () => 'dummy';

  it('should render proper image', () => {
    const imgUrl = 'www.somethingSomewhere.com';
    const renderedComponent = shallow(
      <ProfileStatus ownProfile handleProfileChange={handleProfileChange.bind(this)} status={imgUrl} />
    );

    const img = (
      <span className="user-camera">
        <form id="imageForm" className="uploader" encType="multipart/form-data">
          <input onChange={handleProfileChange.bind(this)} type="file" name="file" className="upload-file" />
          <img className="center-camera" alt="icon" src={camera} />
        </form>
      </span>
  );

    expect(renderedComponent.contains(img)).toEqual(false);
  });

  it('should return camera image on edit', () => {
     const imgUrl = 'www.somethingSomewhere.com';
    const renderedComponent = shallow(
      <ProfileStatus ownProfile handleProfileChange={handleProfileChange.bind(this)} status={imgUrl} />
    );

    const img = (
      <img className="center-camera" alt="icon" src={camera} />
    );

    expect(renderedComponent.contains(img)).toEqual(true);
  });

  it('should return a input on ownProfile', () => {
    const imgUrl = 'www.somethingSomewhere.com';
    const renderedComponent = shallow(
      <ProfileStatus ownProfile handleProfileChange={handleProfileChange.bind(this)} status={imgUrl} />
    );

    const input = (
       <input onChange={handleProfileChange.bind(this)} type="file" name="file" className="upload-file" />
    );

    expect(renderedComponent.contains(input)).toEqual(false);
  });
});
