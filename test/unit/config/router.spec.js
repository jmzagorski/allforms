import RouterConfig from '../../../src/config/router';
import { RouterStub } from '../stubs'

describe('the router configuration', () => {
  let sut;
  let mockedRouter;

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
    expect(sut.router.routes[0]).toEqual({
      route: ['', '/allforms'],
      name: 'allforms',
      moduleId: './forms',
      nav: false
    });
  });

  it('should have a forms directory route', () => {
    expect(sut.router.routes[1]).toEqual({
      route: '/:form',
      name: 'dir',
      moduleId: './directory',
      nav: false
    });
  });

  it('should have a data form edit route', () => {
    expect(sut.router.routes[2]).toEqual({
      route: '/:form/data/:formDataId',
      name: 'formData',
      moduleId: './data-edit',
      nav: false
    });
  });

  it('should have a data new route', () => {
    expect(sut.router.routes[3]).toEqual({
      route: '/:form/data/new',
      name: 'newData',
      moduleId: './data-new',
      nav: false
    });
  });

  it('should have a new form route', () => {
    expect(sut.router.routes[4]).toEqual({
      route: '/new',
      name: 'new-form',
      moduleId: './settings',
      nav: false
    });
  });

  it('should have a data route', () => {
    expect(sut.router.routes[5]).toEqual({
      route: '/:form/data',
      name: 'data',
      moduleId: './data',
      nav: false,
      settings: {
        dirListing: true,
        icon: 'folder',
        description: 'data forms based on your template'
      }
    });
  });

  it('should have a view route', () => {
    expect(sut.router.routes[6]).toEqual({
      route: '/:form/view',
      name: 'view',
      moduleId: './view',
      nav: false,
      settings: {
        dirListing: true,
        icon: 'eye',
        description: 'design how your form will print'
      }
    });
  });

  it('should have a design route', () => {
    expect(sut.router.routes[7]).toEqual({
      route: '/:form/design',
      name: 'design',
      moduleId: './design',
      nav: false,
      settings: {
        dirListing: true,
        icon: 'magic',
        description: 'design the look of your form'
      }
    });
  });

  it('should have a contributors route', () => {
    expect(sut.router.routes[8]).toEqual({
      route: '/:form/contributors',
      name: 'contributors',
      moduleId: './contributors',
      nav: false,
      settings: {
        dirListing: true,
        icon: 'users',
        description: 'maintain user security'
      }
    });
  });

  it('should have a history route', () => {
    expect(sut.router.routes[9]).toEqual({
      route: '/:form/history',
      name: 'history',
      moduleId: './history',
      nav: false,
      settings: {
        dirListing: true,
        icon: 'file-text-o',
        description: 'view changes to your form template'
      }
    });
  });

  it('should have a interface route', () => {
    expect(sut.router.routes[10]).toEqual({
      route: '/:form/interface',
      name: 'interface',
      moduleId: './interface',
      nav: false,
      settings: {
        dirListing: true,
        icon: 'handshake-o',
        description: 'create predefined fields'
      }
    });
  });

  it('should have a settings route', () => {
    expect(sut.router.routes[11]).toEqual({
      route: '/:form/settings',
      name: 'settings',
      moduleId: './settings',
      nav: false,
      settings: {
        dirListing: true,
        icon: 'cog',
        description: 'your form preferences'
      }
    });
  });
});
