import React from 'react';
import type { DomainResult, SearchResponse, WidgetText } from '../types';
import Domain from './Domain';
import ExactDomain from './ExactDomain';

interface Props {
  results: SearchResponse;
  selectedDomains: DomainResult[];
  onSelect: (domain: DomainResult) => void;
  text: WidgetText;
}

const SearchResults: React.FC<Props> = ({ results, selectedDomains, onSelect, text }) => {
  const { exactMatchDomain, suggestedDomains, disclaimer } = results;

  return (
    <div className="result-content">
      <ExactDomain domainResult={exactMatchDomain} text={text} />
      <div className="rstore-exact-domain-list">
        {exactMatchDomain.available && (
          <Domain
            domainResult={exactMatchDomain}
            text={text}
            selected={selectedDomains.includes(exactMatchDomain)}
            onSelect={() => onSelect(exactMatchDomain)}
          />
        )}
      </div>
      <div className="rstore-domain-list">
        {suggestedDomains &&
          suggestedDomains
            .filter((d: DomainResult) => d.available)
            .map((domainResult: DomainResult, index: number) => (
              <Domain
                key={index}
                domainResult={domainResult}
                text={text}
                selected={selectedDomains.includes(domainResult)}
                onSelect={() => onSelect(domainResult)}
              />
            ))}
      </div>
      <div className="rstore-disclaimer"><pre>{disclaimer}</pre></div>
    </div>
  );
};

export default SearchResults;
