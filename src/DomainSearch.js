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

    const domainUrl = `https://storefront.api.${baseUrl}/api/v1/domains/${plid}/?pageSize=${pageSize}`

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

  addDomains(domains) {
    const {
      baseUrl,
      plid
    } = this.props;

    const cartUrl = `https://storefront.api.${baseUrl}/api/v1/cart/${plid}/`;

    const items =[];

    domains.forEach(domain => {
      items.push({
        id: 'domain',
        domain
      });
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ items })
    };

    return util.fetch(cartUrl, options)
  }

  handleContinueClick(e) {
    e.preventDefault();
    this.setState({ addingToCart: true });

    let domains;

    if (this.state.selectedDomains.length === 0 && this.state.exactDomain.available) {
      domains = [this.state.exactDomain.domain];
    }
    else
    {
      domains = this.state.selectedDomains;
    }

    this.addDomains(
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

      return this.setState({
        addingToCart:false
      });

    }).catch(error => {
      this.setState({
        addingToCart:false,
        error: error.message
      });
    });
  }

  handleSelectClick(domainObj) {
    const { selectedDomains } = this.state,
      { domain } = domainObj.props.domainResult;

    const index = selectedDomains.indexOf(domain);
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
    else
    {
      newSelectDomains = [
        ...selectedDomains,
        domain
      ];
       domainObj.setState({
        selected: true,
      });
    }

    console.log(newSelectDomains);
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
            { ((domainCount || exactDomain.available) && !addingToCart) && <button type="button" className="rstore-domain-continue-button button" onClick={this.handleContinueClick} >{this.props.text.cart}</button>}
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
          <div className="result-content">
            {content}
          </div>
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
