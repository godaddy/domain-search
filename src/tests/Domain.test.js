import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
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

let sandbox;

beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

afterEach(() => {
  sandbox.restore();
});

describe('Domain', () => {
  it('should render Domain component', () => {
    shallow(<Domain {...props} />);
  });

  it('should successfully add when domain is selected', () => {
    const wrapper = mount(<Domain {...props} />);

    wrapper.find('a').simulate('click');

    setTimeout(() => {
      expect(wrapper.state('listPrice')).toHaveLength(1);
    }, 50);
  });

  it('should remove item when domain is unselected', () => {
    const wrapper = shallow(<Domain {...props} />);

    wrapper.setState({ selected: true });

    expect(wrapper.find('.rstore-success')).toHaveLength(1);
  });

});
