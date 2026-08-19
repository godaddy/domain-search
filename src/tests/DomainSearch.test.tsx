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

  describe('adding to cart', () => {
    let locationHrefSpy: ReturnType<typeof vi.fn>;
    let windowOpenSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      locationHrefSpy = vi.fn();
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
          ...window.location,
          set href(url: string) {
            locationHrefSpy(url);
          }
        }
      });
      windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    });

    it('adds only the exact match domain when nothing is selected', async () => {
      vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
      vi.spyOn(util, 'addDomainToCart').mockResolvedValue({ cartCount: 1, nextStepUrl: 'https://cart.example/checkout' });
      render(<DomainSearch {...config} />);

      await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
      await userEvent.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => screen.getByRole('button', { name: 'Continue to Cart' }));
      await userEvent.click(screen.getByRole('button', { name: 'Continue to Cart' }));

      await waitFor(() => {
        expect(util.addDomainToCart).toHaveBeenCalledTimes(1);
      });
      expect(util.addDomainToCart).toHaveBeenCalledWith('secureserver.net', '1592', 'test.com');
    });

    it('adds each selected domain sequentially, in selection order', async () => {
      vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
      vi.spyOn(util, 'addDomainToCart').mockResolvedValue({ cartCount: 1, nextStepUrl: 'https://cart.example/checkout' });
      render(<DomainSearch {...config} />);

      await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
      await userEvent.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => screen.getAllByRole('button', { name: 'Select' }));
      const selectButtons = screen.getAllByRole('button', { name: 'Select' });
      // index 0 is the exact match (test.com); index 1/2 are the suggested domains
      await userEvent.click(selectButtons[1]);
      await userEvent.click(selectButtons[2]);

      await userEvent.click(screen.getByRole('button', { name: /Continue to Cart/ }));

      await waitFor(() => {
        expect(util.addDomainToCart).toHaveBeenCalledTimes(2);
      });
      expect(util.addDomainToCart).toHaveBeenNthCalledWith(1, 'secureserver.net', '1592', 'test.net');
      expect(util.addDomainToCart).toHaveBeenNthCalledWith(2, 'secureserver.net', '1592', 'test.org');
    });

    it('stops on first failure, shows an error, and does not navigate', async () => {
      vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
      vi.spyOn(util, 'addDomainToCart').mockRejectedValueOnce(new Error('Domain unavailable'));
      render(<DomainSearch {...config} />);

      await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
      await userEvent.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => screen.getAllByRole('button', { name: 'Select' }));
      const selectButtons = screen.getAllByRole('button', { name: 'Select' });
      await userEvent.click(selectButtons[0]);
      await userEvent.click(selectButtons[1]);

      await userEvent.click(screen.getByRole('button', { name: /Continue to Cart/ }));

      await waitFor(() => {
        expect(screen.getByText('Error: Domain unavailable')).toBeInTheDocument();
      });
      expect(util.addDomainToCart).toHaveBeenCalledTimes(1);
      expect(locationHrefSpy).not.toHaveBeenCalled();
      expect(windowOpenSpy).not.toHaveBeenCalled();
    });

    it('navigates to the last response nextStepUrl on full success', async () => {
      vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
      vi.spyOn(util, 'addDomainToCart')
        .mockResolvedValueOnce({ cartCount: 1, nextStepUrl: 'https://cart.example/first' })
        .mockResolvedValueOnce({ cartCount: 2, nextStepUrl: 'https://cart.example/second' });
      render(<DomainSearch {...config} />);

      await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
      await userEvent.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => screen.getAllByRole('button', { name: 'Select' }));
      const selectButtons = screen.getAllByRole('button', { name: 'Select' });
      await userEvent.click(selectButtons[0]);
      await userEvent.click(selectButtons[1]);

      await userEvent.click(screen.getByRole('button', { name: /Continue to Cart/ }));

      await waitFor(() => {
        expect(locationHrefSpy).toHaveBeenCalledWith('https://cart.example/second');
      });
      expect(windowOpenSpy).not.toHaveBeenCalled();
    });

    it('opens the last response nextStepUrl in a new tab when newTab is true', async () => {
      vi.spyOn(util, 'searchDomains').mockResolvedValue(mockResults);
      vi.spyOn(util, 'addDomainToCart').mockResolvedValue({ cartCount: 1, nextStepUrl: 'https://cart.example/checkout' });
      render(<DomainSearch {...config} newTab={true} />);

      await userEvent.type(screen.getByPlaceholderText('Find your perfect domain name'), 'test.com');
      await userEvent.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => screen.getByRole('button', { name: 'Continue to Cart' }));
      await userEvent.click(screen.getByRole('button', { name: 'Continue to Cart' }));

      await waitFor(() => {
        expect(windowOpenSpy).toHaveBeenCalledWith('https://cart.example/checkout', '_blank');
      });
      expect(locationHrefSpy).not.toHaveBeenCalled();
    });
  });
});
