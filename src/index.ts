import React from 'react';
import { createRoot } from 'react-dom/client';
import DomainSearch from './components/DomainSearch';
import type { WidgetText } from './types';

function getQueryParam(name: string): string | undefined {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) ?? undefined;
}

function mount() {
  const elements = document.querySelectorAll<HTMLElement>('.rstore-domain-search');

  elements.forEach((el) => {
    const plid = el.dataset.plid ?? '';
    const baseUrl = el.dataset.base_url ?? 'secureserver.net';
    const pageSize = parseInt(el.dataset.page_size ?? '5', 10);
    const newTab = el.dataset.new_tab === 'true';
    const domainToCheck = getQueryParam('domainToCheck');

    const text: WidgetText = {
      placeholder: el.dataset.text_placeholder ?? 'Find your perfect domain name',
      search: el.dataset.text_search ?? 'Search',
      available: el.dataset.text_available ?? 'Congrats, {domain_name} is available!',
      notAvailable: el.dataset.text_not_available ?? 'Sorry, {domain_name} is taken.',
      cart: el.dataset.text_cart ?? 'Continue to Cart',
      select: el.dataset.text_select ?? 'Select',
      selected: el.dataset.text_selected ?? 'Selected',
    };

    const root = createRoot(el);
    root.render(
      React.createElement(DomainSearch, { plid, baseUrl, pageSize, newTab, domainToCheck, text })
    );
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}

export { DomainSearch };
export type { WidgetText, WidgetConfig, DomainResult, SearchResponse } from './types';
