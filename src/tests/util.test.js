import sinon from 'sinon';
import util from '../util';

let sandbox;

beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

afterEach(() => {
  sandbox.restore();
});

describe('util', () => {
  it('should fetch url and parse response', () => {
    sandbox.stub(global, 'fetch').callsFake(() => Promise.resolve({
      status: 200,
      text: () => Promise.resolve('{"test":"test"}')
    }));

    util.fetch('test.com', {});
  });
});
