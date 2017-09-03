import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  handleCartClick(e) {
    e.preventDefault();
    this.props.cartClick(this);
    return false;
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
        <div className="rstore-message">
          <div className="rstore-loading"></div>
        </div>
      );
    }
    else if (completed && !error) {
      content = (
        <div className="rstore-message">
          <span className="dashicons dashicons-yes rstore-success"></span>
          <a className="rstore-domain-buy-button submit button selected" onClick={this.handleCartClick}>{this.props.text.selected}</a>
        </div>
      );
    }
    else if (completed && error) {
      content = (
        <div className="rstore-message">
          <span className="dashicons dashicons-no-alt rstore-error"></span>
          {this.props.text.error}
        </div>
      );
    }
    else {
      content = (
        <div className="rstore-message">
          {listPrice !== salePrice && <span className="listPrice"><small><s>{listPrice}</s></small></span>}
          <span className="salePrice"><strong>{salePrice}</strong></span>
           <a className="rstore-domain-buy-button submit button select" onClick={this.handleCartClick}>{this.props.text.select}</a>
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
  text: PropTypes.object.isRequired,
  cartClick: PropTypes.func.isRequired
}
