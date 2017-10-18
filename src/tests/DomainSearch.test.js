import React from 'react';
import { mount, shallow } from 'enzyme';
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

    wrapper.setState({ searching: false, addingToCart: false, exactDomain: { available: true }, suggestedDomains: [] });

    expect(wrapper.find('.rstore-domain-continue-button')).toHaveLength(1);
  });

  it('should render spinner when adding to cart', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    wrapper.setState({ searching: false, addingToCart: true, exactDomain: { available: true }, suggestedDomains: [] });

    expect(wrapper.find('.rstore-loading')).toHaveLength(1);
  });

  it('should render error when adding to cart errors', () => {
    const wrapper = shallow(<DomainSearch {...props} />);

    wrapper.setState({ searching: false, addingToCart: false, error: true, exactDomain: { available: true }, suggestedDomains: [] });

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

  it('should error if domain search fails', (done) => {
    const wrapper = mount(<DomainSearch {...props} />);

    sandbox.stub(util, 'fetch').callsFake(() => Promise.reject('error message'));

    wrapper.ref('domainSearch').value = 'test.com';
    wrapper.find('form').simulate('submit', { preventDefault() {} });

    setTimeout(() => {
      expect(wrapper.find('rstore-error'));
      done();
    }, 50);
  });

  it('should error if domain search returns error message', (done) => {
    const wrapper = mount(<DomainSearch {...props} />);

    sandbox.stub(util, 'fetch').callsFake(() => Promise.resolve({ error: { message: 'error message' } }));

    wrapper.ref('domainSearch').value = 'test.com';
    wrapper.find('form').simulate('submit', { preventDefault() {} });

    setTimeout(() => {
      expect(wrapper.find('rstore-error'));
      done();
    }, 50);
  });

  it('should add suggested domains to state on form submission', (done) => {
    const wrapper = mount(<DomainSearch {...props} />);
    const domain = { domain: 'test.com', available: true, salePrice: '0', listPrice: '0' };

    sandbox.stub(util, 'fetch').callsFake(() => Promise.resolve({
      exactMatchDomain: domain,
      suggestedDomains: [domain]
    }));

    wrapper.ref('domainSearch').value = 'test.com';
    wrapper.find('form').simulate('submit', { preventDefault() {} });

    setTimeout(() => {
      expect(wrapper.state('exactDomain')).toEqual(domain);
      expect(wrapper.state('suggestedDomains')).toEqual([domain]);
      done();
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
    const spy = sandbox.spy(util, 'fetchJsonp');

    wrapper.setState({
      searching: false,
      addingToCart: false,
      exactDomain: {
        available: true,
        domain: '',
        listPrice: '0.00'
      },
      suggestedDomains: []
    });

    wrapper.find('.rstore-domain-continue-button').simulate('click', { preventDefault() {} });

    expect(spy.called).toBeTruthy();
  });

  describe('Given continue to cart button is clicked', () => {
    it('should add selected domains', () => {
      const wrapper = shallow(<DomainSearch {...props} />);
      const spy = sandbox.stub(util, 'fetchJsonp').callsFake(() => Promise.resolve({ cartUrl: '#' }));

      wrapper.setState({
        selectedDomains: ['asdf.com'],
        searching: false,
        addingToCart: false,
        exactDomain: {
          available: true,
          domain: '',
          listPrice: '0.00'
        },
        suggestedDomains: []
      });

      wrapper.find('.rstore-domain-continue-button').simulate('click', { preventDefault() {} });

      expect(spy.called).toBeTruthy();
    });

    it('should set error in state when api has an error', () => {
      const wrapper = shallow(<DomainSearch {...props} />);
      const spy = sandbox.stub(util, 'fetchJsonp').callsFake(() => Promise.resolve({
        error: 'domain no longer available'
      }));

      wrapper.setState({
        selectedDomains: ['asdf.com'],
        searching: false,
        addingToCart: false,
        exactDomain: {
          available: true,
          domain: '',
          listPrice: '0.00'
        },
        suggestedDomains: []
      });

      wrapper.find('.rstore-domain-continue-button').simulate('click', { preventDefault() {} });

      expect(spy.called).toBeTruthy();
    });

    it('should set error in state when network error occurred', () => {
      const wrapper = shallow(<DomainSearch {...props} />);
      const spy = sandbox.stub(util, 'fetchJsonp').callsFake(() => Promise.reject({
        error: 'domain no longer available'
      }));

      wrapper.setState({
        selectedDomains: ['asdf.com'],
        searching: false,
        addingToCart: false,
        exactDomain: {
          available: true,
          domain: '',
          listPrice: '0.00'
        },
        suggestedDomains: []
      });

      wrapper.find('.rstore-domain-continue-button').simulate('click', { preventDefault() {} });

      expect(spy.called).toBeTruthy();
    });

    it('should do nothing when there is no cartUrl and no error', () => {
      const wrapper = shallow(<DomainSearch {...props} />);
      const spy = sandbox.stub(util, 'fetchJsonp').callsFake(() => Promise.resolve({}));

      wrapper.setState({
        selectedDomains: ['asdf.com'],
        searching: false,
        addingToCart: false,
        exactDomain: {
          available: true,
          domain: '',
          listPrice: '0.00'
        },
        suggestedDomains: []
      });

      wrapper.find('.rstore-domain-continue-button').simulate('click', { preventDefault() {} });

      expect(spy.called).toBeTruthy();
    });
  });

  it('should add domain to state when domain is selected', (done) => {
    const wrapper = mount(<DomainSearch {...props} />);

    const exactDomainResult = { available: true, domain: 'available.com', listPrice: '0.00', salePrice: '9.00' };
    const suggestedDomainResult = { available: true, domain: 'suggest.com', listPrice: '0.00', salePrice: '9.00' };

    wrapper.setState({ exactDomain: exactDomainResult, suggestedDomains: [suggestedDomainResult] });

    wrapper.find('.rstore-domain-buy-button').at(0).simulate('click', { preventDefault() {} });
    wrapper.find('.rstore-domain-buy-button').at(1).simulate('click', { preventDefault() {} });

    setTimeout(() => {
      expect(wrapper.state('selectedDomains').length).toEqual(2);

      done();
    }, 50);
  });

  it('should remove domain from state when domain is un-selected', (done) => {
    const wrapper = mount(<DomainSearch {...props} />);
    const exactDomainResult = { available: true, domain: 'available.com', listPrice: '0.00', salePrice: '9.00' };
    const suggestedDomainResult = { available: true, domain: 'suggest.com', listPrice: '0.00', salePrice: '9.00' };

    wrapper.setState({
      exactDomain: exactDomainResult,
      suggestedDomains: [suggestedDomainResult],
      selectedDomains: [exactDomainResult]
    });

    wrapper.find('.rstore-domain-buy-button').at(0).simulate('click', { preventDefault() {} });
    wrapper.find('.rstore-domain-buy-button').at(1).simulate('click', { preventDefault() {} });
    setTimeout(() => {
      expect(wrapper.state('selectedDomains').length).toEqual(1);

      done();
    }, 50);
  });

  it('should post domain to DPP when restricted domain is selected', (done) => {
    const wrapper = mount(<DomainSearch {...props} />);

    const exactDomainResult = { available: true, extendedValidation: true, domain: 'available.com', listPrice: '0.00', salePrice: '9.00' };

    const spy = sandbox.spy(util, 'postDomain');

    wrapper.setState({ exactDomain: exactDomainResult, suggestedDomains: [] });

    wrapper.find('.rstore-domain-buy-button').at(0).simulate('click', { preventDefault() {} });

    setTimeout(() => {
      expect(spy.called).toBeTruthy();

      done();
    }, 50);
  });
});
