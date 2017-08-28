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

    sandbox.stub(global.document, 'getElementsByClassName').callsFake(() => [1, 2, 3]);

    require('../');

    expect(render.callCount).toBe(3);
  });
});
