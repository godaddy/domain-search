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
      this.setState({ domain: this.props.domainToCheck });
      this.search(this.props.domainToCheck);
    }
  }

  handleChange(event) {
    this.setState({ domain: event.target.value });
  }

  search(q) {
    const {
      baseUrl,
      plid,
      pageSize
    } = this.props;

    this.setState({ searching: true });

    const domainUrl = `https://www.${baseUrl}/api/v1/domains/${plid}/`;

    return util.fetchJsonp(domainUrl, { pageSize, q }).then(data => {
        this.setState({
          results: data.exactMatchDomain ? data : null,
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

    return util.fetchJsonp(cartUrl, { cart });
  }

  handleContinueClick(e) {
    e.preventDefault();

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
      if (response.NextStepUrl) {
       return window.location.href = response.NextStepUrl;
      }

      if (response.error){
        return this.setState({
          addingToCart:false,
          error: response.error.message
        });
      }


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
    const {
      searching,
      addingToCart,
      results,
      selectedDomains,
      error
    } = this.state;

    const domainCount = selectedDomains.length;
    const hasExactMatch = results && results.exactMatchDomain && results.exactMatchDomain.available;

    window.onbeforeunload = () => {
      // Most browsers control the return message to the user, we can safely return an empty string here.
      return hasExactMatch || domainCount > 0 ? '' : undefined;
    };

    return (
      <form className="search-form" onSubmit={ this.handleDomainSearch }>
        <div className="input-group">
          <div className="input-group2">
            <label>
              <input type="search" value={ this.state.domain } onChange={ this.handleChange } className="search-field" placeholder={ this.props.text.placeholder } />
            </label>
            <input type="submit" className="rstore-domain-search-button search-submit btn btn-primary" disabled={ searching } value={ this.props.text.search }/>
          </div>
          { results && <span className="input-continue-btn">
            <button type="button" className="rstore-domain-continue-button btn btn-secondary"
              onClick={ this.handleContinueClick }
              disabled={ domainCount === 0 && !hasExactMatch }
              >
              { this.props.text.cart }
              { (domainCount > 0) && `(${domainCount} ${this.props.text.selected})` }
            </button>
          </span> }
        </div>
          { error && <div className="rstore-error">Error: { error }</div> }
          { (addingToCart || searching) && <div className="rstore-loading"></div> }
          { results && <SearchResults results={ results } cartClick={ domain => this.handleSelectClick(domain) } text={ this.props.text }/> }
      </form>
    );
  }
}

DomainSearch.propTypes = {
  plid: PropTypes.string.isRequired,
  text: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired
}
