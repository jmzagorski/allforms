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

  it('should have a home route', () => {
    expect(sut.router.routes[0]).toEqual({
      route: '',
      name: 'home',
      moduleId: './home',
      nav: false
    });
  });

  it('should have a member profile route', () => {
    expect(sut.router.routes[1]).toEqual({
      route: '/:memberId',
      name: 'member',
      moduleId: './forms',
      nav: false
    });
  });

  it('should have a form profile route', () => {
    expect(sut.router.routes[2]).toEqual({
      route: '/:memberId/:formName',
      name: 'dir',
      moduleId: './directory',
      nav: false
    });
  });

  it('should have a data form edit route', () => {
    expect(sut.router.routes[3]).toEqual({
      route: '/:memberId/:formName/:formDataName',
      name: 'formData',
      moduleId: './data-edit',
      nav: false
    });
  });

  it('should have a data new route', () => {
    expect(sut.router.routes[4]).toEqual({
      route: '/:memberId/:formName/new',
      name: 'newData',
      moduleId: './data-new',
      nav: false
    });
  });

  it('should have a new form route', () => {
    expect(sut.router.routes[5]).toEqual({
      route: '/:memberId/new',
      name: 'new-form',
      moduleId: './settings',
      nav: false
    });
  });

  it('should have a snapshot route', () => {
    expect(sut.router.routes[6]).toEqual({
      route: '/:memberId/:formName/:formDataName/snapshot',
      name: 'snapshot',
      moduleId: './snapshot',
      nav: false
    });
  });

  it('should have a interface route', () => {
    expect(sut.router.routes[7]).toEqual({
      route: '/:memberId/:formName/interface',
      name: 'interface',
      moduleId: './interface',
      nav: false
    });
  });


  it('should have a data route', () => {
    expect(sut.router.routes[8]).toEqual({
      route: '/:memberId/:formName/data',
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
    expect(sut.router.routes[9]).toEqual({
      route: '/:memberId/:formName/view',
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
    expect(sut.router.routes[10]).toEqual({
      route: '/:memberId/:formName/design',
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
    expect(sut.router.routes[11]).toEqual({
      route: '/:memberId/:formName/contributors',
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
    expect(sut.router.routes[12]).toEqual({
      route: '/:memberId/:formName/history',
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

  it('should have a settings route', () => {
    expect(sut.router.routes[13]).toEqual({
      route: '/:memberId/:formName/settings',
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
