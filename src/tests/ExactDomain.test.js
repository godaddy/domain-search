import React from 'react';
import { shallow } from 'enzyme';
import ExactDomain from '../ExactDomain';

const props = {
  domain: {
    available: true
  },
  cartUrl: 'storefront.api.secureserver.net/api/v1/cart',
  i18n: {}
};

describe('ExactDomain', () => {
  it('should render ExactDomain component with available domain', () => {
    const wrapper = shallow(<ExactDomain {...props} />);

    expect(wrapper.find('.rstore-exact-domain-list')).toHaveLength(1);
  });

  it('should render ExactDomain component without domain when domain is not available', () => {
    const unavailable = Object.assign({}, props, { domain: { available: false } });
    const wrapper = shallow(<ExactDomain {...unavailable} />);

    expect(wrapper.find('.rstore-exact-domain-list')).toHaveLength(0);
  });
});
