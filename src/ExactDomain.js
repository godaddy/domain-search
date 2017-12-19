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
    const availableText = text.available ? text.available.replace('{domain_name}', domainResult.domain) : `Congrats, ${domainResult.domain} is available!`;

    content = (
      <div className="rstore-exact-domain-list">
        <h4 className="available">{availableText}</h4>
        <Domain {...props} />
      </div>
    );
  }
  else {
    if (domainCount === 0 ) {
      const notAvailableText = text.notAvailable ? text.notAvailable.replace('{domain_name}', domainResult.domain) : `Sorry, ${domainResult.domain} is taken.`;

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
