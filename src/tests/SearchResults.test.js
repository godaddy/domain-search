import React from 'react';
import { shallow } from 'enzyme';
import SearchResults from '../SearchResults';

const props = {
  results: {
    exactMatchDomain: {},
    suggestedDomains: []
  },
  cartClick: () => {},
  text: {}
};

describe('SearchResults', () => {
  it('should render SearchResults component', () => {
    shallow(<SearchResults {...props} />);
  });

  it('should not render Domain buy button when exact match domain is unavailable', () => {
    const newProps = {
      ...props,
      results: {
        exactMatchDomain: { domain: 'test.com', available: false },
        suggestedDomains: []
      },
      text: { notAvailable: '{domain_name} is not available' }
    };

    const wrapper = shallow(<SearchResults {...newProps} />);

    expect(wrapper.find('.rstore-exact-domain-list').children()).toHaveLength(0);
  });

  it('should render Domain buy button when exact match domain is available', () => {
    const newProps = {
      ...props,
      results: {
        exactMatchDomain: { domain: 'test.com', available: true, listPrice: '$9.99', salePrice: '$9.99' },
        suggestedDomains: []
      },
      text: { available: '{domain_name} is available' }
    };

    const wrapper = shallow(<SearchResults {...newProps} />);

    expect(wrapper.find('.rstore-exact-domain-list').children()).toHaveLength(1);
  });

  it('should not render exact match buy button but render suggested available domains', () => {
    const newProps = {
      ...props,
      results: {
        exactMatchDomain: { domain: 'test.com', available: false },
        suggestedDomains: [
          { domain: 'test.net', available: true, listPrice: '$9.99', salePrice: '$9.99' },
          { domain: 'test.org', available: true, listPrice: '$12.99', salePrice: '$12.99' }
        ]
      },
      text: { notAvailable: '{domain_name} is not available' }
    };

    const wrapper = shallow(<SearchResults {...newProps} />);

    expect(wrapper.find('.rstore-exact-domain-list').children()).toHaveLength(0);
    expect(wrapper.find('.rstore-domain-list').children()).toHaveLength(2);
  });
});
