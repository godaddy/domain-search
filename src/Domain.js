import React, { Component } from 'react';
import PropTypes from 'prop-types';
import util from './util';

export default class Domain extends Component {
  constructor() {
    super(...arguments);

    this.handleCartClick = this.handleCartClick.bind(this);

    this.state = {
      addingToCart: false,
      completed: false,
      error: null
    };
  };

  handleCartClick() {
    this.setState({
      addingToCart: true
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        items: [{
          id: 'domain',
          domain: this.props.domainResult.domain,
          productId: this.props.domainResult.productId
        }]
      })
    };

    util.fetch(this.props.cartUrl, options)
      .then(() => {
        this.setState({
          addingToCart: false,
          completed: true,
          error: null
        });
      }).catch(() => {
        this.setState({
          addingToCart: false,
          completed: true,
          error: this.props.i18n.error
        });
      });
  }

  render() {
    const {
      domain,
      listPrice,
      salePrice
    } = this.props.domainResult;

    const {
      addingToCart,
      completed,
      error
    } = this.state;

    let content;

    if (addingToCart && !completed) {
      content = (
        <div className="rstore-loading"></div>
      );
    }
    else if (completed && !error) {
      content = (
        <div className="rstore-message">
          <span className="dashicons dashicons-yes rstore-success"></span>
          <a href={window.rstore.urls.cart}>{this.props.i18n.view_cart}</a>
        </div>
      );
    }
    else if (completed && error) {
      content = (
        <div className="rstore-message">
          <span className="dashicons dashicons-no-alt rstore-error"></span>
          {this.props.i18n.error}
        </div>
      );
    }
    else {
      content = (
        <div className="pricing">
          {listPrice !== salePrice && <span className="listPrice"><small><s>{listPrice}</s></small></span>}
          <span className="salePrice"><strong>{salePrice}</strong></span>
          <button className="rstore-domain-buy-button submit button" onClick={this.handleCartClick}>
            {this.props.i18n.add_to_cart}
          </button>
        </div>
      );
    }

    // istanbul ignore else
    if (domain && listPrice) {
      return (
        <div className="domain-result">
          <div className="domain-name">
            {domain}
          </div>
          <div className="purchase-info">
            {content}
          </div>
        </div>
      );
    }
  }
}

Domain.propTypes = {
  domainResult: PropTypes.object.isRequired,
  cartUrl: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired
}
