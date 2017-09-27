import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ExactDomain from '../ExactDomain';

const props = {
  domainResult:{},
  text: {},
  domainCount: 0,
  cartClick: () => {}
};

beforeAll(() => {
  configure({ adapter: new Adapter() });
});

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
