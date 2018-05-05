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
  hasError: false
};

export default class DomainSearch extends Component {
  constructor() {
    super(...arguments);

    this.handleDomainSearch = this.handleDomainSearch.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);

    this.state = initialState;
  };

  componentDidMount() {
    if (this.props.domainToCheck) {
      this.search(this.props.domainToCheck);
    }
  }

  search(domain) {
    const {
      baseUrl,
      plid,
      pageSize
    } = this.props;

    const domainUrl = `https://www.${baseUrl}/api/v1/domains/${plid}/?pageSize=${pageSize}`

    this.setState({
      searching: true
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ domain })
    };

    util.fetch(domainUrl, options)
      .then(data => {
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
    if (this.refs.domainSearch.value) {
      this.search(this.refs.domainSearch.value);
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
        domain: item.domain,
        productId: item.productId
      });
    });

    var param = "?cart="+JSON.stringify({ items });

    return util.fetchJsonp(cartUrl+param);
  }

  handleContinueClick(e) {
    // istanbul ignore next
    e && e.preventDefault();

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
          <SearchResults results={results} cartClick={(domain) => this.handleSelectClick(domain)} {...this.props}/>
        </div>
      );
    }

    return (
      <form onSubmit={this.handleDomainSearch}>
        <div className="search-box">
          <div className="input-group">
            <div className="input-group2">
              <input type="text" ref="domainSearch" className="search-field form-control" placeholder={this.props.text.placeholder} defaultValue={this.props.domainToCheck}/>
              <span className="input-search-btn">
                <button type="submit" className="rstore-domain-search-button submit button btn btn-primary" disabled={searching}>{this.props.text.search}</button>
              </span>
            </div>
            { results && <span className="input-continue-btn">
               <button type="button" className="rstore-domain-continue-button button btn btn-primary"
                 onClick={() => this.handleContinueClick()}
                 disabled={ domainCount===0 && !(results.exactMatchDomain.available) }
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
