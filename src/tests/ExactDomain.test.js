import React from 'react';
import { shallow } from 'enzyme';
import ExactDomain from '../ExactDomain';

const props = {
  domainResult:{},
  text: {
    available: '',
    notAvailable: 'Sorry, {domain_name} is taken.'
  },
  domainCount: 0,
  cartClick: () => {},
  continueClick: () => {},
  showButton: false
};

describe('ExactDomain', () => {
  it('should render ExactDomain component with available domain', () => {
     const available = {
      ...props,
      showButton: true,
      available: true,
      text: {
        available: 'Congratulations, {domain_name} is available.',
        notAvailable: ''
      }
    };

    const wrapper = shallow(<ExactDomain {...available} />);

    expect(wrapper.find('.rstore-exact-domain-list')).toHaveLength(1);
  });

  it('should render ExactDomain component without domain when domain is not available', () => {
    const unavailable = {
      ...props,
      domainResult:{
        domain: 'test.com'
      },
      available: false,
      text: {
        notAvailable: 'Oops, {domain_name} is taken.'
      }
    };
    const wrapper = shallow(<ExactDomain {...unavailable} />);

    expect(wrapper.find('.rstore-exact-domain-list')).toHaveLength(1);
    expect(wrapper.find('.not-available')).toHaveLength(1);
    expect(wrapper.find('.not-available').text()).toEqual('Oops, test.com is taken.');
  });

  it('should render domain not available message when domain is not available and text.notAvailable is not provided', () => {
    const unavailable = {
      ...props,
      domainResult:{
        domain: 'test1.com'
      },
      available: false
    };
    const wrapper = shallow(<ExactDomain {...unavailable} />);

    expect(wrapper.find('.rstore-exact-domain-list')).toHaveLength(1);
    expect(wrapper.find('.not-available')).toHaveLength(1);
    expect(wrapper.find('.not-available').text()).toEqual('Sorry, test1.com is taken.');
  });

  it('should render nothing when domain is not available and domains are selected', () => {
    const unavailable = {
      ...props,
      available: false,
      domainCount: 1
    };
    const wrapper = shallow(<ExactDomain {...unavailable} />);

    expect(wrapper.find('.rstore-exact-domain-list')).toHaveLength(1);
    expect(wrapper.find('.not-available')).toHaveLength(0);
  });
});
