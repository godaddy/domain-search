import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DomainSearch from '../components/DomainSearch';
import * as util from '../util';
import type { WidgetConfig, SearchResponse } from '../types';

const config: WidgetConfig = {
  plid: '1592',
  baseUrl: 'secureserver.net',
  pageSize: 5,
  newTab: false,
  text: {
    placeholder: 'Find your perfect domain name',
    search: 'Search',
    available: 'Congrats, {domain_name} is available!',
    notAvailable: 'Sorry, {domain_name} is taken.',
    cart: 'Continue to Cart',
    select: 'Select',
    selected: 'Selected'
  }
};

const mockResults: SearchResponse = {
  exactMatchDomain: { domain: 'test.com', available: true, listPrice: '$9.99', salePrice: '$9.99' },
  suggestedDomains: [
    { domain: 'test.net', available: true, listPrice: '$8.99', salePrice: '$8.99' },
    { domain: 'test.org', available: true, listPrice: '$7.99', salePrice: '$7.99' }
  ]
};

const mockResultsUnavailable: SearchResponse = {
  exactMatchDomain: { domain: 'test.com', available: false },
  suggestedDomains: []
};

describe('DomainSearch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders search input and button', () => {
    render(<DomainSearch {...config} />);
    expect(screen.getByPlaceholderText('Find your perfect domain name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('updates input value on change', async () => {
    render(<DomainSearch {...config} />);
    const input = screen.getByPlaceholderText('Find your perfect domain name');
    await userEvent.type(input, 'test.com');
    expect(input).toHaveValue('test.com');
  });

  it('calls searchDomains and renders results on submit', async () => {
    vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Congrats, test.com is available!')).toBeInTheDocument();
    });
  });

  it('shows continue to cart button after search completes', async () => {
    vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Continue to Cart' })).toBeInTheDocument();
    });
  });

  it('continue to cart button is enabled when exact match is available', async () => {
    vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Continue to Cart' })).not.toBeDisabled();
    });
  });

  it('continue to cart button is disabled when exact match unavailable and nothing selected', async () => {
    vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResultsUnavailable);
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Continue to Cart' })).toBeDisabled();
    });
  });

  it('shows domain count in continue button when domains are selected', async () => {
    vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => screen.getAllByRole('button', { name: 'Select' }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Select' })[0]);

    expect(screen.getByRole('button', { name: 'Continue to Cart (1 Selected)' })).toBeInTheDocument();
  });

  it('toggles domain selection off when clicked again', async () => {
    vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => screen.getAllByRole('button', { name: 'Select' }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Select' })[0]);
    expect(screen.getByRole('button', { name: 'Continue to Cart (1 Selected)' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Selected' }));
    expect(screen.getByRole('button', { name: 'Continue to Cart' })).toBeInTheDocument();
  });

  it('shows error message when search fails', async () => {
    vi.spyOn(util, 'searchDomains').mockRejectedValue(new Error('Network error'));
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  it('shows error from API response', async () => {
    vi.spyOn(util, 'searchDomains').mockResolvedValue({
      ...mockResults,
      error: { message: 'Invalid request' }
    });
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Error: Invalid request')).toBeInTheDocument();
    });
  });

  it('pre-fills domain from domainToCheck prop', async () => {
    vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
    render(<DomainSearch {...config} domainToCheck="prefilled.com" />);

    expect(screen.getByPlaceholderText('Find your perfect domain name')).toHaveValue('prefilled.com');
    await waitFor(() => {
      expect(util.searchDomains).toHaveBeenCalledWith('secureserver.net', '1592', 'prefilled.com', 5);
    });
  });
});
