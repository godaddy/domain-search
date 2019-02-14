import React from 'react';
import { mount, shallow } from 'enzyme';
import Domain from '../Domain';

const props = {
  domainResult: {
    domain: 'test.com',
    listPrice: '$9.99',
    salePrice: '$7.99'
  },
  cartClick: () => {},
  text: {}
};

describe('Domain', () => {
  it('should render Domain component', () => {
    shallow(<Domain {...props} />);
  });

  it('should render Domain component for restricted domains', () => {
    const newProps = {
      ...props,
      domainResult: {extendedValidation: true, listPrice: '$7.99'}
    };

    shallow(<Domain {...newProps} />);
  });

  it('should render Domain component for restricted domains not on sales', () => {
    const newProps = {
      ...props,
      domainResult: {extendedValidation: true}
    };

    shallow(<Domain {...newProps} />);
  });

  it('should successfully add when domain is selected', () => {
    const wrapper = mount(<Domain {...props} />);

    wrapper.find('button').simulate('click');

    setTimeout(() => {
      expect(wrapper.state('listPrice')).toHaveLength(1);
    }, 50);
  });

  it('should remove item when domain is unselected', () => {
    const wrapper = shallow(<Domain {...props} />);

    wrapper.setState({ selected: true });
    wrapper.find('button').simulate('click');

    expect(wrapper.find('.rstore-success')).toHaveLength(1);
  });

});
