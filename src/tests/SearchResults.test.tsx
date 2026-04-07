import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchResults from '../components/SearchResults';
import type { SearchResponse, WidgetText } from '../types';

const text: WidgetText = {
  placeholder: '',
  search: '',
  available: 'Congrats, {domain_name} is available!',
  notAvailable: 'Sorry, {domain_name} is taken.',
  cart: '',
  select: 'Select',
  selected: 'Selected'
};

const baseResults: SearchResponse = {
  exactMatchDomain: { domain: 'test.com', available: false },
  suggestedDomains: []
};

describe('SearchResults', () => {
  it('renders without crashing', () => {
    render(<SearchResults results={baseResults} selectedDomains={[]} onSelect={vi.fn()} text={text} />);
  });

  it('does not render exact match buy button when domain is unavailable', () => {
    const { container } = render(
      <SearchResults results={baseResults} selectedDomains={[]} onSelect={vi.fn()} text={text} />
    );
    expect(container.querySelector('.rstore-exact-domain-list')?.children).toHaveLength(0);
  });

  it('renders exact match buy button when domain is available', () => {
    const results: SearchResponse = {
      exactMatchDomain: { domain: 'test.com', available: true, listPrice: '$9.99', salePrice: '$9.99' },
      suggestedDomains: []
    };
    const { container } = render(
      <SearchResults results={results} selectedDomains={[]} onSelect={vi.fn()} text={text} />
    );
    expect(container.querySelector('.rstore-exact-domain-list')?.children).toHaveLength(1);
  });

  it('renders suggested available domains', () => {
    const results: SearchResponse = {
      exactMatchDomain: { domain: 'test.com', available: false },
      suggestedDomains: [
        { domain: 'test.net', available: true, listPrice: '$9.99', salePrice: '$9.99' },
        { domain: 'test.org', available: true, listPrice: '$12.99', salePrice: '$12.99' }
      ]
    };
    const { container } = render(
      <SearchResults results={results} selectedDomains={[]} onSelect={vi.fn()} text={text} />
    );
    expect(container.querySelector('.rstore-domain-list')?.children).toHaveLength(2);
  });

  it('does not render unavailable suggested domains', () => {
    const results: SearchResponse = {
      exactMatchDomain: { domain: 'test.com', available: false },
      suggestedDomains: [
        { domain: 'test.net', available: false },
        { domain: 'test.org', available: true, salePrice: '$9.99' }
      ]
    };
    const { container } = render(
      <SearchResults results={results} selectedDomains={[]} onSelect={vi.fn()} text={text} />
    );
    expect(container.querySelector('.rstore-domain-list')?.children).toHaveLength(1);
  });

  it('does not render exact match buy button but renders suggested available domains', () => {
    const results: SearchResponse = {
      exactMatchDomain: { domain: 'test.com', available: false },
      suggestedDomains: [
        { domain: 'test.net', available: true, listPrice: '$9.99', salePrice: '$9.99' },
        { domain: 'test.org', available: true, listPrice: '$12.99', salePrice: '$12.99' }
      ]
    };
    const { container } = render(
      <SearchResults results={results} selectedDomains={[]} onSelect={vi.fn()} text={text} />
    );
    expect(container.querySelector('.rstore-exact-domain-list')?.children).toHaveLength(0);
    expect(container.querySelector('.rstore-domain-list')?.children).toHaveLength(2);
  });
});
