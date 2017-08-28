import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import DomainSearch from '../DomainSearch';
import SearchResults from '../SearchResults';
import util from '../util';

const props = {
  cartUrl: 'storefront.api.secureserver.net/api/v1/cart',
  domainUrl: 'storefront.api.secureserver.net/api/v1/domains',
  i18n: {}
};

let sandbox;

beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

afterEach(() => {
  sandbox.restore();
});

describe('DomainSearch', () => {
  it('should render DomainSearch component', () => {
    shallow(<DomainSearch {...props} />);
  });

  it('should render spinner when searching', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    wrapper.setState({ searching: true, completed: false });

    expect(wrapper.find('.rstore-loading')).toHaveLength(1);
  });

  it('should not call handleDomainSearch when an empty form is submitted', () => {
    const wrapper = mount(<DomainSearch {...props} />);
    const spy = sandbox.spy(util, 'fetch');

    wrapper.find('form').simulate('submit', { preventDefault() {} });

    expect(spy.called).toBeFalsy();
  });

  it('should error if domain search fails', () => {
    const wrapper = mount(<DomainSearch {...props} />);

    sandbox.stub(util, 'fetch').callsFake(() => Promise.reject());

    wrapper.ref('domainSearch').get(0).value = 'test.com';
    wrapper.find('form').simulate('submit', { preventDefault() {} });

    setTimeout(() => {
      expect(wrapper.state('completed')).toEqual(true);
    }, 50);
  });

  it('should add suggested domains to state on form submission', () => {
    const wrapper = mount(<DomainSearch {...props} />);
    const domain = 'test.com';

    sandbox.stub(util, 'fetch').callsFake(() => Promise.resolve({
      exactMatchDomain: { domain },
      suggestedDomains: [{ domain }]
    }));

    wrapper.ref('domainSearch').get(0).value = 'test.com';
    wrapper.find('form').simulate('submit', { preventDefault() {} });

    setTimeout(() => {
      expect(wrapper.state('exactMatchDomain')).toEqual({ domain });
      expect(wrapper.state('suggestedDomains')).toEqual([{ domain }]);
      expect(wrapper.state('completed')).toEqual(true);
    }, 50);
  });

  it('should give domain results after searching', () => {
    const wrapper = shallow(<DomainSearch {...props} />);
    const searchProps = {
      domains: [],
      cartUrl: 'storefront.api.secureserver.net/api/v1/cart',
      i18n: {}
    };

    wrapper.setState({ searching: true, completed: true });

    expect(wrapper.find(<SearchResults {...searchProps} />));
  });
});
