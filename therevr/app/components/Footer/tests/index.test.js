import React from 'react';
import { shallow } from 'enzyme';

import Footer from 'components/Footer';

describe('<Footer />', () => {
  let renderedComponent;

  beforeEach(() => {
    renderedComponent = shallow(
      <Footer />
    );
  });

  it('Should a container', () => {
    expect(renderedComponent.contains(<div />)).toEqual(false);
  });
});
