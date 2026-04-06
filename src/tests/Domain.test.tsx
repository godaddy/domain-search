import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Domain from '../components/Domain';
import type { DomainResult, WidgetText } from '../types';

const text: WidgetText = {
  placeholder: '',
  search: '',
  available: '',
  notAvailable: '',
  cart: '',
  select: 'Select',
  selected: 'Selected'
};

const domainResult: DomainResult = {
  domain: 'test.com',
  available: true,
  listPrice: '$9.99',
  salePrice: '$7.99'
};

describe('Domain', () => {
  it('renders domain name', () => {
    render(<Domain domainResult={domainResult} text={text} selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText('test.com')).toBeInTheDocument();
  });

  it('renders select button when not selected', () => {
    render(<Domain domainResult={domainResult} text={text} selected={false} onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
  });

  it('renders selected button when selected', () => {
    render(<Domain domainResult={domainResult} text={text} selected={true} onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Selected' })).toBeInTheDocument();
  });

  it('renders sale price', () => {
    render(<Domain domainResult={domainResult} text={text} selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText('$7.99')).toBeInTheDocument();
  });

  it('renders list price when different from sale price', () => {
    render(<Domain domainResult={domainResult} text={text} selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('does not render list price when equal to sale price', () => {
    const samePriceDomain = { ...domainResult, listPrice: '$7.99', salePrice: '$7.99' };
    render(<Domain domainResult={samePriceDomain} text={text} selected={false} onSelect={vi.fn()} />);
    expect(document.querySelector('.listPrice')).not.toBeInTheDocument();
  });

  it('does not render sale price when missing', () => {
    const noPriceDomain: DomainResult = { domain: 'test.ai', available: true, productId: 123 };
    render(<Domain domainResult={noPriceDomain} text={text} selected={false} onSelect={vi.fn()} />);
    expect(document.querySelector('.salePrice')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
  });

  it('shows asterisk for extended validation domains', () => {
    const evDomain = { ...domainResult, extendedValidation: true };
    render(<Domain domainResult={evDomain} text={text} selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText('$7.99*')).toBeInTheDocument();
  });

  it('calls onSelect when button is clicked', async () => {
    const onSelect = vi.fn();
    render(<Domain domainResult={domainResult} text={text} selected={false} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: 'Select' }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('renders empty div when domain is missing', () => {
    const emptyDomain: DomainResult = { domain: '', available: false };
    const { container } = render(<Domain domainResult={emptyDomain} text={text} selected={false} onSelect={vi.fn()} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
