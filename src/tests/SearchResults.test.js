import React from 'react';
import { shallow } from 'enzyme';
import SearchResults from '../SearchResults';

const props = {
  domains: [{
    available: true
  }],
  cartUrl: 'storefront.api.secureserver.net/api/v1/cart',
  i18n: {}
};

describe('SearchResults', () => {
  it('should render SearchResults component', () => {
    shallow(<SearchResults {...props} />);
  });
});
