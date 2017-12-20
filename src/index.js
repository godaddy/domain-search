import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import queryString from 'query-string';

const elements = document.getElementsByClassName('rstore-domain-search');
Array.prototype.forEach.call(elements, element => {
  //variable naming is based on WordPress coding standards
  // https://make.wordpress.org/core/handbook/best-practices/coding-standards/php/#naming-conventions
  const text = {
    placeholder: element.dataset.text_placeholder || "Find your perfect domain name",
    search: element.dataset.text_search || "Search",
    available: element.dataset.text_available || "Congrats, {domain_name} is available!",
    notAvailable: element.dataset.text_not_available || "Sorry, {domain_name} is taken.",
    cart: element.dataset.text_cart || "Continue to Cart",
    select: element.dataset.text_select || "Select",
    selected: element.dataset.text_selected || "Selected",
    verify: element.dataset.text_verify || "Verify",
    disclaimer: element.dataset.text_disclaimer || "Taxes and ICANN fee not included in price displayed.\n*Additional charges and registration restrictions may apply."
  },
  baseUrl = element.dataset.base_url || "secureserver.net",
  pageSize = element.dataset.page_size || "5",
  parsed = queryString.parse(window.location.search);

  return ReactDOM.render(
    <App text={text} plid={element.dataset.plid} baseUrl={baseUrl} pageSize={pageSize} domainToCheck={parsed.domainToCheck}/>,
    element
  );
});
