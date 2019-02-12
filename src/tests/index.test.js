import ReactDOM from 'react-dom';

import sinon from 'sinon';

describe('App', () => {
  let sandbox;

  beforeEach(() => {
    sinon.createSandbox();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render for each rstore-domain-search', () => {
    const render = sinon.stub(ReactDOM, 'render').callsFake(() => {});

    const element = {
      dataset: {
        plid: '123'
      }
    }

    sinon.stub(global.document, 'getElementsByClassName').callsFake(() => [element, element, element]);

    require('../');

    expect(render.callCount).toBe(3);
  });
});
