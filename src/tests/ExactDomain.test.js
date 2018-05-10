import React from 'react';
import { shallow } from 'enzyme';
import ExactDomain from '../ExactDomain';

describe('ExactDomain', () => {
  it('should render ExactDomain component with available domain', () => {
    const available = {
      domainResult: {
        available: true
      },
      text: {
        available: 'Congratulations, {domain_name} is available.',
        notAvailable: ''
      }
    };

    const wrapper = shallow(<ExactDomain {...available} />);

    expect(wrapper.find('.available')).toHaveLength(1);
  });

  it('should render ExactDomain component without domain when domain is not available', () => {
    const unavailable = {
      domainResult:{
        domain: 'test.com',
        available: false
      },
      text: {
        notAvailable: 'Oops, {domain_name} is taken.'
      }
    };
    const wrapper = shallow(<ExactDomain {...unavailable} />);

    expect(wrapper.find('.not-available')).toHaveLength(1);
    expect(wrapper.find('.not-available').text()).toEqual('Oops, test.com is taken.');
  });
});
