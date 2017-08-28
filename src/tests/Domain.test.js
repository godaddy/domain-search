import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Domain from '../Domain';
import util from '../util';

const props = {
  domainResult: {
    domain: 'test.com',
    listPrice: '$9.99',
    salePrice: '$7.99'
  },
  cartUrl: 'storefront.api.secureserver.net/api/v1/cart',
  i18n: {}
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

  it('should render spinner when searching', () => {
    const wrapper = shallow(<Domain {...props} />);

    wrapper.setState({ addingToCart: true, completed: false });

    expect(wrapper.find('.rstore-loading')).toHaveLength(1);
  });

  it('should call handleCartClick on button click', () => {
    const wrapper = shallow(<Domain {...props} />);

    wrapper.find('button').simulate('click');
  });

  it('should error if item cannot be added to cart', () => {
    const wrapper = mount(<Domain {...props} />);

    sandbox.stub(util, 'fetch').callsFake(() => Promise.reject());

    wrapper.find('button').simulate('click');

    setTimeout(() => {
      expect(wrapper.state('completed')).toEqual(true);
    }, 50);
  });

  it('should successfully add item to cart when valid data is provided', () => {
    const wrapper = mount(<Domain {...props} />);

    sandbox.stub(util, 'fetch').callsFake(() => Promise.resolve());

    wrapper.find('button').simulate('click');

    setTimeout(() => {
      expect(wrapper.state('completed')).toEqual(true);
      expect(wrapper.state('error')).toBeNull();
    }, 50);
  });

  it('should render success message when a domain is added to the cart', () => {
    const wrapper = shallow(<Domain {...props} />);

    wrapper.setState({ addingToCart: true, completed: true });

    expect(wrapper.find('.rstore-success')).toHaveLength(1);
  });

  it('should render error message when a domain fails to be added to the cart', () => {
    const wrapper = shallow(<Domain {...props} />);

    wrapper.setState({ addingToCart: true, completed: true, error: 'error' });

    expect(wrapper.find('.rstore-error')).toHaveLength(1);
  });
});
