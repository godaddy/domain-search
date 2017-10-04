import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

const props = {
  plid: '123',
  baseUrl: '',
  text: {}
};

describe('App', () => {
  it('should render App component', () => {
    shallow(<App {...props} />);
  });
});
