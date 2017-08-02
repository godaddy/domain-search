import React from 'react';
import PropTypes from 'prop-types';
import Domain from './Domain';

const ExactDomain = ({ domain, cartUrl, i18n }) => {
  let content;

  if (domain.available) {
    content = (
      <div className="rstore-exact-domain-list">
        <h4>{i18n.available}</h4>
        <Domain domainResult={domain} cartUrl={cartUrl} i18n={i18n}/>
      </div>
    );
  }
  else {
    content = (
      <div>
        <h4>{i18n.not_available}</h4>
      </div>
    );
  }

  return content;
}

ExactDomain.propTypes = {
  domain: PropTypes.object.isRequired,
  cartUrl: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired
}

export default ExactDomain;
