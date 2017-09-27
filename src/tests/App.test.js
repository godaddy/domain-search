import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../App';

const props = {
  plid: '123',
  baseUrl: '',
  text: {}
};

beforeAll(() => {
  configure({ adapter: new Adapter() });
});

describe('App', () => {
  it('should render App component', () => {
    shallow(<App {...props} />);
  });
});
