import React from 'react';
import PropTypes from 'prop-types';
import Domain from './Domain';

const SearchResults = ({ domains, text,  cartClick}) => {
  return (
    <div>
      <div className="rstore-domain-list">
        {domains.map((domain, index) => {
          return domain.available && (<Domain key={index} domainResult={domain} text={text} cartClick={cartClick}/>);
        })}
      </div>
    </div>
  );
};

SearchResults.propTypes = {
  domains: PropTypes.array.isRequired,
  text: PropTypes.object.isRequired,
  cartClick: PropTypes.func.isRequired
}

export default SearchResults;
