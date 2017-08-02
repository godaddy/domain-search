import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import SearchResults from './SearchResults';
import ExactDomain from './ExactDomain';

export default class DomainSearch extends Component {
  constructor(props) {
    super(props);
    this.handleDomainSearch = this.handleDomainSearch.bind(this);

    this.state = {
      domain: {},
      suggestedDomains: [],
      completed: true,
      searching: false
    }
  };

  handleDomainSearch(e) {
    e.preventDefault();

    if (!this.refs.domainSearch.value) {
      return false;
    }

    this.setState({
      completed: false,
      searching: true
    });

    const data = {
      domain: this.refs.domainSearch.value
    }

    $.ajax({
      method: "POST",
      url: this.props.domainUrl,
      data,
      crossDomain: true
    }).then(response => {
      this.setState({
        domain: response.exactMatchDomain,
        suggestedDomains: response.suggestedDomains,
        completed: true
      });
    }).catch(() => {
      this.setState({
        completed: true
      });
    });
  }

  render() {
    let content;

    const {
      searching,
      completed,
      domain,
      suggestedDomains
    } = this.state;

    if (searching && !completed) {
      content = (
        <div className="rstore-loading"></div>
      );
    }
    else if (searching && completed) {
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
              <button type="submit" className="rstore-domain-search-button submit button">{this.props.i18n.search}</button>
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
