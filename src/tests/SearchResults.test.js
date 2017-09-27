import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SearchResults from '../SearchResults';

const props = {
  domains: [{
    available: true
  }],
  cartClick: () => {},
  text: {}
};

beforeAll(() => {
  configure({ adapter: new Adapter() });
});

describe('SearchResults', () => {
  it('should render SearchResults component', () => {
    shallow(<SearchResults {...props} />);
  });
});
