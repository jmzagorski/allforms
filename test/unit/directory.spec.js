import { Store } from 'aurelia-redux-plugin';
import { Directory } from '../../src/directory';
import { Router } from 'aurelia-router';
import { setupSpy } from './jasmine-helpers';
import * as selectors from '../../src/domain/form/selectors';
import { requestForm } from '../../src/domain/index';

describe('the directory view model', () => {
  let sut;
  let routerSpy;
  let storeSpy;
  let formStub;
  let getFormSpy;
  const params = { form: 'a' };

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerSpy = setupSpy('router', Router.prototype);
    getFormSpy = spyOn(selectors, 'getActiveForm');

    sut = new Directory(routerSpy, storeSpy);
  });

  it('defines the routes', () => {
    expect(sut.routes).toEqual([]);
  });

  it('dispatches a request for the form on activate', () => {
    sut.activate({ form: 'a' });

    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestForm('a'));
  });

  it('listens for the form to update to get the routes', () => {
    let updateFunc = null;
    const state = {};
    routerSpy.routes = [{
      name: 'a',
      settings: { dirListing: true, icon: 'c', description: 'd' }
    }, {
      name: 'b',
      settings: { dirListing: true, icon: 'e', description: 'f' }
    }, {
      name: 'notshown', settings: {}
    }];

    storeSpy.getState.and.returnValue(state);
    getFormSpy.and.returnValue({ id: 1});
    routerSpy.generate.and.returnValues('/g', '/h');
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({ });

    updateFunc();

    expect(getFormSpy.calls.argsFor(0)[0]).toBe(state);
    expect(routerSpy.generate.calls.count()).toEqual(2);
    expect(routerSpy.generate).toHaveBeenCalledWith('a', { form: 1 });
    expect(routerSpy.generate).toHaveBeenCalledWith('b', { form: 1 });
    expect(sut.routes).toEqual([{
      url: '/g', description: 'd', icon: 'c', name: 'a'
    }, {
      url: '/h', description: 'f', icon: 'e', name: 'b'
    }])
  });

  // if you dont clear the routes any update may duplicate the routes
  it('refreshes the route array on each update', () => {
    let updateFunc = null;
    sut.routes = [ 1 ];
    routerSpy.routes = [];

    getFormSpy.and.returnValue({ });
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({ });

    updateFunc();

    expect(sut.routes).toEqual([]);
  });

  it('does not generate routes when form does not exist', () => {
    let updateFunc = null;

    getFormSpy.and.returnValue(null);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({ });

    updateFunc();

    expect(sut.routes).toEqual([]);
  });

  it('unsubscribes on deactivate', () => {
    let unsubscribe = false;
    const subscription = () => unsubscribe = true;

    storeSpy.subscribe.and.returnValue(subscription);
    sut.activate({ });

    sut.deactivate();

    expect(unsubscribe).toBeTruthy();
  });
});
