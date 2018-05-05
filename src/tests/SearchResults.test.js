import React from 'react';
import { shallow } from 'enzyme';
import SearchResults from '../SearchResults';

const props = {
  results: {
    exactMatchDomain: {},
    suggestedDomains: []
  },
  cartClick: () => {},
  text: {},
  plid: '1592',
  baseUrl: 'secureserver.net'
};

describe('SearchResults', () => {
  it('should render SearchResults component', () => {
    shallow(<SearchResults {...props} />);
  });
});
