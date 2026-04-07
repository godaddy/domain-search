import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ExactDomain from '../components/ExactDomain';
import type { DomainResult, WidgetText } from '../types';

const text: WidgetText = {
  placeholder: '',
  search: '',
  available: 'Congrats, {domain_name} is available!',
  notAvailable: 'Sorry, {domain_name} is taken.',
  cart: '',
  select: '',
  selected: ''
};

const availableDomain: DomainResult = { domain: 'test.com', available: true };
const unavailableDomain: DomainResult = { domain: 'test.com', available: false };

describe('ExactDomain', () => {
  it('shows available message when domain is available', () => {
    render(<ExactDomain domainResult={availableDomain} text={text} />);
    expect(screen.getByText('Congrats, test.com is available!')).toBeInTheDocument();
    expect(document.querySelector('.available')).toBeInTheDocument();
  });

  it('shows not available message when domain is unavailable', () => {
    render(<ExactDomain domainResult={unavailableDomain} text={text} />);
    expect(screen.getByText('Sorry, test.com is taken.')).toBeInTheDocument();
    expect(document.querySelector('.not-available')).toBeInTheDocument();
  });
});
