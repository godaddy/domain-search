import React from 'react';
import PropTypes from 'prop-types';

const ExactDomain = (props) => {
  const {
    domainResult,
    text
  } = props;

  let content = null;

  if (domainResult.available) {
    const availableText = text.available.replace('{domain_name}', domainResult.domain);
    content = (
      <p className="available">{ availableText }</p>
    );
  }
  else {
    const notAvailableText = text.notAvailable.replace('{domain_name}', domainResult.domain);
    content = (
      <p className="not-available">{ notAvailableText }</p>
    );
  }

  return content;
}

ExactDomain.propTypes = {
  domainResult: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired
}

export default ExactDomain;
