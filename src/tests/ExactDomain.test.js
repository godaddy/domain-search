import React from 'react';
import { shallow } from 'enzyme';
import ExactDomain from '../ExactDomain';

const props = {
  domainResult:{},
  text: {},
  domainCount: 0,
  cartClick: () => {}
};

describe('ExactDomain', () => {
  it('should render ExactDomain component with available domain', () => {
     const available = {
      ...props,
      available: true
    };

    const wrapper = shallow(<ExactDomain {...available} />);

    expect(wrapper.find('.rstore-exact-domain-list')).toHaveLength(1);
  });

  it('should render ExactDomain component without domain when domain is not available', () => {
    const unavailable = {
      ...props,
      available: false
    };
    const wrapper = shallow(<ExactDomain {...unavailable} />);

    expect(wrapper.find('.rstore-exact-domain-list')).toHaveLength(1);
    expect(wrapper.find('.not-available')).toHaveLength(1);
  });
});
