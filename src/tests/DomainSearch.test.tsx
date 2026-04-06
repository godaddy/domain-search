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

  it('shows error message when search fails', async () => {
    vi.spyOn(util, 'searchDomains').mockRejectedValue(new Error('Network error'));
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
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
      expect(screen.getByText('Invalid request')).toBeInTheDocument();
    });
  });

  it('shows continue to cart button when a domain is selected', async () => {
    vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => screen.getAllByRole('button', { name: 'Select' }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Select' })[0]);

    expect(screen.getByRole('button', { name: 'Continue to Cart' })).toBeInTheDocument();
  });

  it('toggles domain selection off when clicked again', async () => {
    vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
    render(<DomainSearch {...config} />);

    await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => screen.getAllByRole('button', { name: 'Select' }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Select' })[0]);
    expect(screen.getByRole('button', { name: 'Continue to Cart' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Selected' }));
    expect(screen.queryByRole('button', { name: 'Continue to Cart' })).not.toBeInTheDocument();
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
