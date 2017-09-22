import React from 'react';
import { shallow } from 'enzyme';
import SearchResults from '../SearchResults';

const props = {
  domains: [{
    available: true
  }],
  cartClick: () => {},
  text: {}
};

describe('SearchResults', () => {
  it('should render SearchResults component', () => {
    shallow(<SearchResults {...props} />);
  });
});
