import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const elements = document.getElementsByClassName('rstore-domain-search');
Array.prototype.forEach.call(elements, element => {
  const text = {
    placeholder: element.dataset.textPlaceholder || "Find your perfect domain name",
    search: element.dataset.textSearch || "Search",
    available: element.dataset.textAvailable || "Congrats, your domain is available!",
    notAvailable: element.dataset.textNotAvailable || "Sorry that domain is taken",
    cart: element.dataset.textCart || "Continue to Cart",
    select: element.dataset.textSelect || "Select",
    selected: element.dataset.textSelected || "Selected"
  },
  baseUrl = element.dataset.baseUrl||"secureserver.net",
  pageSize = element.dataset.pageSize || "5";

  return ReactDOM.render(
    <App text={text} plid={element.dataset.plid} baseUrl={baseUrl} pageSize={pageSize} />,
    element
  );
});
