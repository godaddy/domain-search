import raf from 'raf';
import { configure } from 'enzyme';

raf.polyfill();

beforeAll(() => {
  const Adapter = require('enzyme-adapter-react-16');
  configure({ adapter: new Adapter() });
});
