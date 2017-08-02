import React from 'react';
import PropTypes from 'prop-types';
import Domain from './Domain';

const SearchResults = ({ domains, cartUrl, i18n }) => {
  return (
    <div className="rstore-domain-list">
      {domains.map((domain, index) => {
        return domain.available && (<Domain key={index} domainResult={domain} cartUrl={cartUrl} i18n={i18n} />);
      })}
    </div>
  );
};

SearchResults.propTypes = {
  domains: PropTypes.array.isRequired,
  cartUrl: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired
}

export default SearchResults;
