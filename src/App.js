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
          <DomainSearch cartUrl={this.state.cartUrl} domainUrl={this.state.domainUrl} i18n={this.state.i18n} />
        </div>
      </div>
    );
  }
}

export default App;
