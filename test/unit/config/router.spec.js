import RouterConfig from '../../../src/config/router';
import using from 'jasmine-data-provider';
import {RouterStub} from '../stubs'

describe('the router configuration', () => {
  var sut;
  var mockedRouter;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new RouterConfig(mockedRouter);
    sut.configure();
  });

  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
  });

  it('configures the router title', () => {
    expect(sut.router.title).toEqual('AllForms');
  });

  it('should have a forms route', () => {
    expect(sut.router.routes).toContain({
      route: ['', '/allforms'],
      name: 'allforms',
      moduleId: './forms',
      nav: false
    });
  });

  it('should have a forms directory route', () => {
    expect(sut.router.routes).toContain({
      route: '/:form',
      name: 'dir',
      moduleId: './directory',
      nav: false
    });
  });

  it('should have a data edit route', () => {
    expect(sut.router.routes).toContain({
      route: '/:form/data/:formDataId',
      name: 'formData',
      moduleId: './data-edit',
      nav: false
    });
  });

  it('should have a data new route', () => {
    expect(sut.router.routes).toContain({
      route: '/:form/data/new',
      name: 'newData',
      moduleId: './data-new',
      nav: false
    });
  });

  using(['view', 'design', 'data', 'lookups', 'contributors', 'history', 'snapshots', 'settings'], route => {
    it('should have a sub route off the from dir', () => {
      expect(sut.router.routes).toContain({
        route: '/:form/' + route,
        name: route, 
        moduleId: './' + route,
        nav: false
      });
    });
  })
});
