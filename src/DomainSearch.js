import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchResults from './SearchResults';
import ExactDomain from './ExactDomain';
import util from './util';
import queryString from 'query-string'

const initialState = {
  domain: null,
  suggestedDomains: null,
  searching: false,
  domainCount: 0
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
          domain: data.exactMatchDomain,
          suggestedDomains: data.suggestedDomains,
          searching: false
        });
      }).catch(() => {
        this.setState(initialState);
      });
  }

  addPendingDomain(domain, add) {
    const params = {
      applyBP: 1,
      pl_id: this.props.plid,
      domain,
      domainstatus: 'available'
    };

    const cartStatus = add ? 1 : 2;

    const dppUrl = `https://www.${this.props.baseUrl}/api/dpp/searchresultscart/${cartStatus}?${queryString.stringify(params)}`;

    const options = {
      method: 'GET',
      credentials: 'include',
      mode: 'no-cors'
    };
    return util.fetch(dppUrl, options)
  }

  handleContinueClick(e) {
    e.preventDefault();
    const configurationUrl = `https://www.${this.props.baseUrl}/domains/domain-configuration.aspx?pl_id=${this.props.plid}`;

    if (this.state.domainCount === 0 && this.state.domain.available) {
      this.addPendingDomain(
        this.state.domain.domain,
        true,
      ).then(() => {
        window.location.href = configurationUrl;
      });
    }
    else
    {
     window.location.href = configurationUrl;
    }
  }

  handleCartClick(domain) {
    domain.setState({
      addingToCart: true
    });

    this.addPendingDomain(
      domain.props.domainResult.domain,
      !domain.state.completed,
    ).then(response => {
      domain.setState({
        addingToCart: false,
        completed: !domain.state.completed,
        error: null,
      });

      if (domain.state.completed) {
        this.setState({ domainCount: this.state.domainCount + 1 })
      }
      else {
        this.setState({ domainCount: this.state.domainCount - 1 })
      }
    }).catch( (error) => {
      domain.setState({
        addingToCart: false,
        completed: true,
        error: this.props.text.error
      });
    });
  }

  render() {
    let content;

    const {
      searching,
      domain,
      suggestedDomains,
      domainCount
    } = this.state;

    if (searching) {
      content = (
        <div className="rstore-loading"></div>
      );
    }
    else if (domain || suggestedDomains) {
      content = (
        <div>
          <div className="continue-block">
            { (domainCount || domain.available) && <button type="button" className="rstore-domain-continue-button button" onClick={this.handleContinueClick} >{this.props.text.cart}</button>}
          </div>
          <ExactDomain domainResult={domain} cartClick={(domain) => this.handleCartClick(domain)} text={this.props.text} domainCount={domainCount} />
          <SearchResults domains={suggestedDomains} cartClick={(domain) => this.handleCartClick(domain)} text={this.props.text} />
        </div>
      );
    }
    else {
      content = ('');
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
