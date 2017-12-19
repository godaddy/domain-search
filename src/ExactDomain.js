import React from 'react';
import PropTypes from 'prop-types';
import Domain from './Domain';

const ExactDomain = (props) => {
  const {
    domainResult,
    text,
    domainCount
  } = props;

  let content = null;

  if (domainResult.available) {
    content = (
      <div className="rstore-exact-domain-list">
        <h4 className="available">{text.available}</h4>
        <Domain {...props} />
      </div>
    );
  }
  else {
    if (domainCount === 0 ) {
      const notAvailableText = text.notAvailable ? text.notAvailable.replace('{domain_name}', domainResult.domain) : '';

      content = (
        <div className="rstore-exact-domain-list" >
          <h4 className="not-available">{notAvailableText}</h4>
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
  domainCount: PropTypes.number.isRequired
}

export default ExactDomain;
