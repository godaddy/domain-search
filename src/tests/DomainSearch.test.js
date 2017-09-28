import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import DomainSearch from '../DomainSearch';
import SearchResults from '../SearchResults';
import util from '../util';

const props = {
  plid: '123',
  text: {},
  baseUrl: 'secureserver.net'
};

let sandbox;

beforeAll(() => {
  configure({ adapter: new Adapter() });
});

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

    wrapper.setState({ searching: true });

    expect(wrapper.find('.rstore-loading')).toHaveLength(1);
  });

  it('should render continue button when domain is available', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    wrapper.setState({ searching: false, addingToCart: false, exactDomain : { available: true }, suggestedDomains : []  });

    expect(wrapper.find('.rstore-domain-continue-button')).toHaveLength(1);
  });

  it('should render spinner when adding to cart', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    wrapper.setState({ searching: false, addingToCart: true, exactDomain : { available: true }, suggestedDomains : []  });

    expect(wrapper.find('.rstore-loading')).toHaveLength(1);
  });

  it('should render error when adding to cart errors', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    wrapper.setState({ searching: false, addingToCart: false, error: true, exactDomain : { available: true }, suggestedDomains : []  });

    expect(wrapper.find('.rstore-error')).toHaveLength(1);
  });

  it('should render error when domain search errors', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    wrapper.setState({ searching: false, addingToCart: false, error: true });

    expect(wrapper.find('.rstore-error')).toHaveLength(1);
  });

  it('should not call handleDomainSearch when an empty form is submitted', () => {
    const wrapper = mount(<DomainSearch {...props} />);
    const spy = sandbox.spy(util, 'fetch');

    wrapper.find('form').simulate('submit', { preventDefault() {} });

    expect(spy.called).toBeFalsy();
  });

  it('should error if domain search fails', () => {
    const wrapper = mount(<DomainSearch {...props} />);

    sandbox.stub(util, 'fetch').callsFake(() => Promise.reject('error message'));

    wrapper.ref('domainSearch').value = 'test.com';
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

    wrapper.ref('domainSearch').value = 'test.com';
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
      cartClick: () => {},
      text: {}
    };

    wrapper.setState({ searching: true, completed: true });

    expect(wrapper.find(<SearchResults {...searchProps} />));
  });

  it('should add exact domain when continue to cart button is clicked', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    const spy = sandbox.spy(util, 'fetch');

    wrapper.setState({ searching: false, addingToCart: false, exactDomain : { available: true, domain:'', listPrice: '0.00' }, suggestedDomains : []  });

    wrapper.find('.rstore-domain-continue-button').simulate('click', { preventDefault() {} });

    expect(spy.called).toBeTruthy();
  });

  it('should add selected domains when continue to cart button is clicked', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    const spy = sandbox.stub(util, 'fetch').callsFake(() => Promise.resolve({
       cartUrl: '#'
    }));

    wrapper.setState({ selectedDomains:[ 'asdf.com'], searching: false, addingToCart: false, exactDomain : { available: true, domain:'', listPrice: '0.00' }, suggestedDomains : []  });

    wrapper.find('.rstore-domain-continue-button').simulate('click', { preventDefault() {} });

    expect(spy.called).toBeTruthy();
  });

  it('should set error in state when continue to cart button is clicked and api has an error', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    const spy = sandbox.stub(util, 'fetch').callsFake(() => Promise.resolve({
       error: 'domain no longer available'
    }));

    wrapper.setState({ selectedDomains:[ 'asdf.com'], searching: false, addingToCart: false, exactDomain : { available: true, domain:'', listPrice: '0.00' }, suggestedDomains : []  });

    wrapper.find('.rstore-domain-continue-button').simulate('click', { preventDefault() {} });

    expect(spy.called).toBeTruthy();
  });

  it('should do nothing when continue to cart button is clicked and there is no cartUrl and no error', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    const spy = sandbox.stub(util, 'fetch').callsFake(() => Promise.resolve({}));

    wrapper.setState({ selectedDomains:[ 'asdf.com'], searching: false, addingToCart: false, exactDomain : { available: true, domain:'', listPrice: '0.00' }, suggestedDomains : []  });

    wrapper.find('.rstore-domain-continue-button').simulate('click', { preventDefault() {} });

    expect(spy.called).toBeTruthy();
  });

});
