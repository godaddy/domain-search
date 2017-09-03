import React from 'react';
import PropTypes from 'prop-types';
import DomainSearch from './DomainSearch';

const App = ( props ) => {
  return (
    <div className="App">
      <div className="container">
        <DomainSearch {...props} />
      </div>
    </div>
  );
}

App.propTypes = {
  plid: PropTypes.string.isRequired,
  text: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired
}

export default App;
