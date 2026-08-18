import React, { Fragment, useEffect, useState } from 'react';
import type { DomainResult, SearchResponse, WidgetConfig } from '../types';
import { addDomainToCart, searchDomains } from '../util';
import SearchResults from './SearchResults';

interface Props extends WidgetConfig {}

const DomainSearch: React.FC<Props> = ({ plid, baseUrl, pageSize, newTab, domainToCheck, text }) => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<DomainResult[]>([]);

  const domainCount = selectedDomains.length;
  const hasExactMatch = results?.exactMatchDomain?.available ?? false;

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!submitting && (hasExactMatch || domainCount > 0)) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [submitting, hasExactMatch, domainCount]);

  useEffect(() => {
    if (domainToCheck) {
      setDomain(domainToCheck);
      handleSearch(domainToCheck);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setSearching(true);
    setError('');
    setResults(null);
    setSelectedDomains([]);

    try {
      const data = await searchDomains(baseUrl, plid, query, pageSize);
      setResults(data.exactMatchDomain ? data : null);
      setError(data.error ? data.error.message : '');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.length > 0) handleSearch(domain);
  };

  const handleSelect = (domainResult: DomainResult) => {
    setSelectedDomains((prev) =>
      prev.includes(domainResult)
        ? prev.filter((d) => d !== domainResult)
        : [...prev, domainResult]
    );
  };

  const getDomainsToAdd = (): DomainResult[] => {
    if (!results) return [];

    if (selectedDomains.length === 0 && results.exactMatchDomain.available) {
      return [results.exactMatchDomain];
    }

    return selectedDomains;
  };

  const handleAddToCart = async () => {
    const domainsToAdd = getDomainsToAdd();
    if (domainsToAdd.length === 0) return;

    setSubmitting(true);
    setError('');

    try {
      let nextStepUrl = '';

      for (const d of domainsToAdd) {
        const data = await addDomainToCart(baseUrl, plid, d.domain);
        nextStepUrl = data.nextStepUrl;
      }

      if (newTab) {
        window.open(nextStepUrl, '_blank');
      } else {
        window.location.href = nextStepUrl;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Fragment>
      <div className="form-container">
        <form className="search-form" onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="search"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="search-field rstore-domain-search-input"
            placeholder={text.placeholder}
          />
          <input
            type="submit"
            className="search-submit rstore-domain-search-button btn btn-primary"
            disabled={searching || submitting}
            value={text.search}
          />
        </form>
      </div>

      {results && (
        <div className="continue-form">
          <button
            type="button"
            className="rstore-domain-continue-button btn btn-secondary"
            onClick={handleAddToCart}
            disabled={(domainCount === 0 && !hasExactMatch) || submitting}
          >
            {text.cart}
            {domainCount > 0 && ` (${domainCount} ${text.selected})`}
          </button>
        </div>
      )}

      {error && <div className="rstore-error">Error: {error}</div>}
      {(searching || submitting) && !newTab && <div className="rstore-loading" />}
      {results && (
        <SearchResults
          results={results}
          selectedDomains={selectedDomains}
          onSelect={handleSelect}
          text={text}
        />
      )}
    </Fragment>
  );
};

export default DomainSearch;
