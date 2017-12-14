import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchResults from './SearchResults';
import ExactDomain from './ExactDomain';
import util from './util';

const initialState = {
  exactDomain: null,
  suggestedDomains: null,
  searching: false,
  addingToCart: false,
  error: '',
  selectedDomains: []
};

export default class DomainSearch extends Component {
  constructor() {
    super(...arguments);

    this.handleDomainSearch = this.handleDomainSearch.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);

    this.state = initialState;
  };

  handleDomainSearch(e) {
    e.preventDefault();
    const {
      baseUrl,
      plid,
      pageSize
    } = this.props;

    const domainUrl = `https://www.${baseUrl}/api/v1/domains/${plid}/?pageSize=${pageSize}`

    if (!this.refs.domainSearch.value) {
      return false;
    }

    this.setState({
      searching: true
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ domain: this.refs.domainSearch.value })
    };

    util.fetch(domainUrl, options)
      .then(data => {
        this.setState({
          exactDomain: data.exactMatchDomain,
          suggestedDomains: data.suggestedDomains,
          error: data.error ? data.error.message : '',
          searching: false
        });
      }).catch(error => {
        this.setState({
          searching: false,
          error: error.message
        });
      });
  }

  addDomainsToCart(domains) {
    const {
      baseUrl,
      plid
    } = this.props;

    const cartUrl = `https://www.${baseUrl}/api/v1/cart/${plid}/`;
    const items =[];

    domains.forEach(item => {
      items.push({
        id: 'domain',
        domain: item.domain,
        productId: item.productId
      });
    });

    var param = "?cart="+JSON.stringify({ items });

    return util.fetchJsonp(cartUrl+param);
  }

  handleContinueClick(e) {
    e.preventDefault();

    const {
      baseUrl,
      plid
    } = this.props;

    const {
      selectedDomains,
      exactDomain
    } = this.state;

    this.setState({ addingToCart: true });

    let domains;

    if (selectedDomains.length === 0 && exactDomain.available) {
      domains = [exactDomain];
    }
    else {
      domains = selectedDomains;
    }

    this.addDomainsToCart(
      domains
    ).then(response => {
      if (response.cartUrl) {
       return window.location.href = response.cartUrl;
      }

      if (response.error){
        return this.setState({
          addingToCart:false,
          error: response.error.message
        });
      }

      return window.location.href = `https://cart.${baseUrl}/?plid=${plid}`

    }).catch(error => {
      this.setState({
        addingToCart:false,
        error: error.message
      });
    });
  }

  handleSelectClick(domainObj) {
    const { selectedDomains } = this.state;

    const {
      domain,
      extendedValidation
    } = domainObj.props.domainResult;

    const {
      baseUrl,
      plid
    } = this.props;

    if (extendedValidation) {
      this.setState({ addingToCart: true });

      const url = `https://www.${baseUrl}/domains/search.aspx?checkAvail=1&plid=${plid}`;

      return util.postDomain(url, domain);
    }

    const index = selectedDomains.indexOf(domainObj.props.domainResult);
    let newSelectDomains = [];

    if (index >= 0 ){
      newSelectDomains = [
        ...selectedDomains.slice(0, index),
        ...selectedDomains.slice(index+1)
      ];

      domainObj.setState({
        selected: false,
      });
    }
    else {
      newSelectDomains = [
        ...selectedDomains,
        domainObj.props.domainResult
      ];

      domainObj.setState({
        selected: true,
      });
    }

    this.setState({ selectedDomains: newSelectDomains });
  }

  render() {
    let content;

    const {
      searching,
      addingToCart,
      exactDomain,
      suggestedDomains,
      selectedDomains,
      error
    } = this.state;

    const domainCount = selectedDomains.length;

    if (searching) {
      content = (
        <div className="rstore-loading"></div>
      );
    }
    else if (exactDomain || suggestedDomains) {
      content = (
        <div>
          <div className="continue-block">
            { (( domainCount ||
              (exactDomain.available && !exactDomain.extendedValidation)) &&
              !addingToCart &&
              !error ) &&
              <button type="button" className="rstore-domain-continue-button button" onClick={this.handleContinueClick} >{this.props.text.cart}</button>}
            { (addingToCart) && <div className="rstore-loading"></div>}
            { (error) && <div className="rstore-error">Error: {error}</div>}
          </div>
          <ExactDomain domainResult={exactDomain} cartClick={(domain) => this.handleSelectClick(domain)} text={this.props.text} domainCount={domainCount} />
          <SearchResults domains={suggestedDomains} cartClick={(domain) => this.handleSelectClick(domain)} text={this.props.text} />
        </div>
      );
    }
    else {
      content = (
        (error) && <div className="rstore-error">Error: {error}</div>
      );
    }

    return (
      <form onSubmit={this.handleDomainSearch}>
        <div className="search-box">
          <div className="input-group">
            <input type="text" ref="domainSearch" className="search-field form-control" placeholder={this.props.text.placeholder} />
            <span className="input-group-btn">
              <button type="submit" className="rstore-domain-search-button submit button" disabled={searching}>{this.props.text.search}</button>
            </span>
          </div>
        </div>
        <div className="result-content">
          {content}
          {(exactDomain || suggestedDomains) && (<div className="rstore-disclaimer"><pre>{this.props.text.disclaimer}</pre></div>)}
        </div>
      </form>
    );
  }
}

DomainSearch.propTypes = {
  plid: PropTypes.string.isRequired,
  text: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired
}
