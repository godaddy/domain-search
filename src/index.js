import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const elements = document.getElementsByClassName('rstore-domain-search');

Array.prototype.forEach.call(elements, element => {
  return ReactDOM.render(
    <App />,
    element
  );
});
