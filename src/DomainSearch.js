import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchResults from './SearchResults';
import ExactDomain from './ExactDomain';
import util from './util';

const initialState = {
  domain: null,
  suggestedDomains: null,
  searching: false
};

export default class DomainSearch extends Component {
  constructor() {
    super(...arguments);

    this.handleDomainSearch = this.handleDomainSearch.bind(this);

    this.state = initialState;
  };

  handleDomainSearch(e) {
    e.preventDefault();

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

    util.fetch(this.props.domainUrl, options)
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

  render() {
    let content;

    const {
      searching,
      domain,
      suggestedDomains
    } = this.state;

    if (searching) {
      content = (
        <div className="rstore-loading"></div>
      );
    }
    else if (domain || suggestedDomains) {
      content = (
        <div>
          <ExactDomain domain={domain} cartUrl={this.props.cartUrl} i18n={this.props.i18n} />
          <SearchResults domains={suggestedDomains} cartUrl={this.props.cartUrl} i18n={this.props.i18n} />
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
            <input type="text" ref="domainSearch" className="search-field form-control" placeholder={this.props.i18n.placeholder} />
            <span className="input-group-btn">
              <button type="submit" className="rstore-domain-search-button submit button" disabled={searching}>{this.props.i18n.search}</button>
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
  cartUrl: PropTypes.string.isRequired,
  domainUrl: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired
}
