import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Domain extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      selected: false
    };
  };

  render() {
    const {
      domain,
      listPrice,
      salePrice,
      extendedValidation,
      disclaimer
    } = this.props.domainResult;

    const {
      text,
      cartClick
    } = this.props;

    let content;

    if (this.state.selected) {
      content = (
        <div className="rstore-message">
          <span className="dashicons dashicons-yes rstore-success"></span>
          <a className="rstore-domain-buy-button submit button selected btn btn-default" onClick={ ()=>cartClick(this) }>{ text.selected }</a>
        </div>
      );
    }
    else {
      content = (
        <div className="rstore-message">
          { listPrice !== salePrice && <span className="listPrice"><small><s>{ listPrice }</s></small></span> }
          <span className="salePrice"><strong>{ salePrice}{extendedValidation && '*' }</strong></span>
           <a className="rstore-domain-buy-button submit button select btn btn-secondary" onClick={ ()=>cartClick(this) }>{ text.select }</a>
        </div>
      );
    }

    if (domain && listPrice) {
      return (
        <div className="domain-result">
          <div className="domain-name">
            { domain }
            <span className="rstore-disclaimer"><pre>{ disclaimer }</pre></span>
          </div>
          <div className="purchase-info">
            { content }
          </div>
        </div>
      );
    }

    return(<div></div>);
  }
}

Domain.propTypes = {
  domainResult: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired,
  cartClick: PropTypes.func.isRequired
}
