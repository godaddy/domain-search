import React from 'react';
import PropTypes from 'prop-types';
import Domain from './Domain';
import ExactDomain from './ExactDomain';

const SearchResults = ({ results, cartClick, plid, text, baseUrl }) => {
  const {
    exactMatchDomain,
    suggestedDomains,
    disclaimer
  } = results;

  return (
    <div className="result-content">
      <ExactDomain domainResult={ exactMatchDomain } text={ text } />
      <div className="rstore-exact-domain-list">
        <Domain domainResult={ exactMatchDomain } text={ text } cartClick={ cartClick }/>
      </div>
      <div className="rstore-domain-list">
        { suggestedDomains && suggestedDomains.map((domainResult, index) => {
          return domainResult.available && (<Domain key={ index } domainResult={ domainResult } text={ text } cartClick={ cartClick }/>);
        })}
      </div>
      <div className="rstore-disclaimer"><pre>{ disclaimer }</pre></div>
    </div>
  );
};

SearchResults.propTypes = {
  results: PropTypes.object.isRequired,
  cartClick: PropTypes.func.isRequired,
  text: PropTypes.object.isRequired
}

export default SearchResults;
