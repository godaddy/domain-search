import sinon from 'sinon';
import util from '../util';
import fetchJsonp from 'fetch-jsonp';

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

  describe('Given empty response', () => {
    it('should fetch url and return empty object', () => {
      sandbox.stub(global, 'fetch').callsFake(() => Promise.resolve({
        status: 200,
        text: () => Promise.resolve('')
      }));

      util.fetch('test.com', {});
    });
  });

  describe('Given postDomain', () => {
    it('should form post the domain to the url', () => {
      util.postDomain('#', 'test.com');
    });
  });
});
