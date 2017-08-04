import React, { Component } from 'react';
import DomainSearch from './DomainSearch';

class App extends Component {
  componentWillMount() {
    this.state = {
      cartUrl: window.rstore.urls.cart_api,
      domainUrl: window.rstore.urls.domain_api,
      i18n: window.rstore.i18n
    }
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <DomainSearch {...this.state} />
        </div>
      </div>
    );
  }
}

export default App;
