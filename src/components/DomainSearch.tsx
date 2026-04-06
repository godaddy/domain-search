import React, { useEffect, useRef, useState } from 'react';
import type { DomainResult, SearchResponse, WidgetConfig } from '../types';
import { searchDomains } from '../util';
import SearchResults from './SearchResults';

interface Props extends WidgetConfig {}

const DomainSearch: React.FC<Props> = ({ plid, baseUrl, pageSize, newTab, domainToCheck, text }) => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<DomainResult[]>([]);

  const cartFormRef = useRef<HTMLFormElement>(null);
  const cartItemsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (domainToCheck) {
      setDomain(domainToCheck);
      handleSearch(domainToCheck);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedDomains.length > 0) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
    return () => {
      window.onbeforeunload = null;
    };
  }, [selectedDomains]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setSearching(true);
    setError('');
    setResults(null);
    setSelectedDomains([]);

    try {
      const data = await searchDomains(baseUrl, plid, query, pageSize);

      if (data.error) {
        setError(data.error.message);
      } else {
        setResults(data);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(domain);
  };

  const handleSelect = (domainResult: DomainResult) => {
    setSelectedDomains((prev) =>
      prev.includes(domainResult)
        ? prev.filter((d) => d !== domainResult)
        : [...prev, domainResult]
    );
  };

  const handleContinue = () => {
    if (!cartFormRef.current || !cartItemsRef.current) return;

    const items = selectedDomains.map((d) => ({ id: 'domain', domain: d.domain }));
    cartItemsRef.current.value = JSON.stringify(items);

    window.onbeforeunload = null;
    setSubmitting(true);
    cartFormRef.current.submit();
  };

  const cartUrl = `https://www.${baseUrl}/api/v1/cart/${plid}/?redirect=true`;

  return (
    <div>
      <div className="form-container">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="rstore-domain-search-input"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder={text.placeholder}
          />
          <button type="submit" className="rstore-domain-search-button btn btn-primary">
            {text.search}
          </button>
        </form>
      </div>

      {searching && (
        <div className="rstore-loading">
          <img src="/loading.svg" alt="loading" />
        </div>
      )}

      {error && <div className="rstore-error">{error}</div>}

      {results && !searching && (
        <>
          <SearchResults
            results={results}
            selectedDomains={selectedDomains}
            onSelect={handleSelect}
            text={text}
          />
          {selectedDomains.length > 0 && (
            <button
              className="rstore-cart-button btn btn-primary"
              onClick={handleContinue}
              disabled={submitting}
            >
              {text.cart}
            </button>
          )}
        </>
      )}

      <form
        ref={cartFormRef}
        method="POST"
        action={cartUrl}
        target={newTab ? '_blank' : '_self'}
        style={{ display: 'none' }}
      >
        <input ref={cartItemsRef} type="hidden" name="items" />
      </form>
    </div>
  );
};

export default DomainSearch;
