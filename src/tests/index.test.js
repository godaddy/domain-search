import ReactDOM from 'react-dom';

import sinon from 'sinon';

describe('App', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render for each rstore-domain-search', () => {
    const render = sandbox.stub(ReactDOM, 'render').callsFake(() => {});

    const element = {
      dataset: {
        plid: '123'
      }
    }

    sandbox.stub(global.document, 'getElementsByClassName').callsFake(() => [element, element, element]);

    require('../');

    expect(render.callCount).toBe(3);
  });
});
