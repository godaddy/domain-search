import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Domain extends Component {
  constructor() {
    super(...arguments);

    this.handleSelectClick = this.handleSelectClick.bind(this);

    this.state = {
      selected: false
    };
  };

  handleSelectClick(e) {
    e.preventDefault();
    this.props.cartClick(this);
    return false;
  }

  render() {
    const {
      domain,
      listPrice,
      salePrice,
      extendedValidation
    } = this.props.domainResult;

    const {
      selected,
    } = this.state;

    let content;

    const buttonText = extendedValidation ? this.props.text.verify : this.props.text.select;

    if (selected) {
      content = (
        <div className="rstore-message">
          <span className="dashicons dashicons-yes rstore-success"></span>
          <a className="rstore-domain-buy-button submit button selected btn btn-default" onClick={this.handleSelectClick}>{this.props.text.selected}</a>
        </div>
      );
    }
    else {
      content = (
        <div className="rstore-message">
          {listPrice !== salePrice && <span className="listPrice"><small><s>{listPrice}</s></small></span>}
          <span className="salePrice"><strong>{salePrice}{extendedValidation && '*'}</strong></span>
           <a className="rstore-domain-buy-button submit button select btn btn-default" onClick={this.handleSelectClick}>{buttonText}</a>
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
