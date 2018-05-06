import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchResults from './SearchResults';

import util from './util';

const initialState = {
  results: null,
  searching: false,
  addingToCart: false,
  error: '',
  selectedDomains: [],
  hasError: false,
  domain: ''
};

export default class DomainSearch extends Component {
  constructor() {
    super(...arguments);

    this.handleChange = this.handleChange.bind(this);
    this.handleDomainSearch = this.handleDomainSearch.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);

    this.state = initialState;
  };

  componentDidMount() {
    if (this.props.domainToCheck) {
      this.setState({domain: this.props.domainToCheck});
      this.search(this.props.domainToCheck);
    }
  }

  handleChange(event) {
    this.setState({domain: event.target.value});
  }

  search(q) {
    const {
      baseUrl,
      plid,
      pageSize
    } = this.props;

    this.setState({
      searching: true
    });

    const domainUrl = `https://www.${baseUrl}/api/v1/domains/${plid}/`;

    return util.fetchJsonp(domainUrl, { pageSize, q }).then(data => {
        this.setState({
          results: data,
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

  handleDomainSearch(e) {
    e.preventDefault();
    if (this.state.domain.length > 0) {
      this.search(this.state.domain);
    }
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
        domain: item.domain
      });
    });

    var cart = JSON.stringify({ items });

    return util.fetchJsonp(cartUrl, {cart});
  }

  handleContinueClick(e) {
    e.preventDefault();

    const {
      baseUrl,
      plid
    } = this.props;

    const {
      selectedDomains,
      results
    } = this.state;

    this.setState({ addingToCart: true });

    let domains;

    if (selectedDomains.length === 0 && results.exactMatchDomain.available) {
      domains = [results.exactMatchDomain];
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
      results,
      selectedDomains,
      error
    } = this.state;

    const domainCount = selectedDomains.length;

    if (searching) {
      content = (
        <div className="rstore-loading"></div>
      );
    }
    else if (results && results.exactMatchDomain) {
      content = (
        <div>
          { (addingToCart) && <div className="rstore-loading"></div>}
          <SearchResults results={results} cartClick={(domain) => this.handleSelectClick(domain)} text={this.props.text}/>
        </div>
      );
    }

    return (
      <form onSubmit={this.handleDomainSearch}>
        <div className="search-box">
          <div className="input-group">
            <div className="input-group2">
              <input type="text" value={this.state.domain} onChange={this.handleChange} className="search-field form-control" placeholder={this.props.text.placeholder} />
              <span className="input-search-btn">
                <button type="submit" className="rstore-domain-search-button submit button btn btn-primary" disabled={searching}>{this.props.text.search}</button>
              </span>
            </div>
            { results && <span className="input-continue-btn">
               <button type="button" className="rstore-domain-continue-button button btn btn-secondary"
                 onClick={this.handleContinueClick}
                 disabled={ domainCount===0 && !(results.exactMatchDomain && results.exactMatchDomain.available) }
                 >
                  {this.props.text.cart}  { (domainCount > 0) &&  `(${domainCount} ${this.props.text.selected})` }
               </button>
            </span>}
          </div>
        </div>
        <div className="result-content">
          {(error) && <div className="rstore-error">Error: {error}</div>}
          {content}
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
