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
      route: ['', '/:form/allforms'],
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

  using(['view', 'design', 'lookups', 'users', 'history'], route => {
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
