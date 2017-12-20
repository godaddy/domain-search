import React from 'react';
import PropTypes from 'prop-types';
import Domain from './Domain';

const ExactDomain = (props) => {
  const {
    continueClick,
    domainResult,
    text,
    domainCount,
    showButton
  } = props;

  let content = null;

  if (domainResult.available) {
    const availableText = text.available.replace('{domain_name}', domainResult.domain);

    content = (
      <div className="rstore-exact-domain-list">
        { (( domainCount ||
          (domainResult.available && !domainResult.extendedValidation)) && showButton ) &&
          <button type="button" className="rstore-domain-continue-button button btn btn-primary" onClick={continueClick} >{text.cart}</button>}
        <p className="available">{availableText}</p>
        {<Domain {...props} />}
      </div>
    );
  }
  else {
    if (domainCount === 0 ) {
      const notAvailableText = text.notAvailable.replace('{domain_name}', domainResult.domain);

      content = (
        <div className="rstore-exact-domain-list" >
          <p className="not-available">{notAvailableText}</p>
        </div>
      );
    }
    else {
      content = (
        <div className="rstore-exact-domain-list" >
          <button type="button" className="rstore-domain-continue-button button btn btn-primary" onClick={continueClick} >{text.cart}</button>
        </div>
      );
    }
  }

  return content;
}

ExactDomain.propTypes = {
  domainResult: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired,
  cartClick: PropTypes.func.isRequired,
  continueClick: PropTypes.func.isRequired,
  domainCount: PropTypes.number.isRequired,
  showButton: PropTypes.bool.isRequired
}

export default ExactDomain;
