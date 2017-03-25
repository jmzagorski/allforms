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
  let getHistorySpy;
  const params = { form: 'a' };

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerSpy = setupSpy('router', Router.prototype);
    getHistorySpy = spyOn(selectors, 'getRecentFormHistory');

    sut = new Directory(routerSpy, storeSpy);
  });

  it('defines the history routes', () => {
    expect(sut.historyRoutes).toEqual([]);
  });

  it('dispatches a request for the form on activate', () => {
    sut.activate({ form: 'a' });

    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestForm('a'));
  });

  it('listens for the form to update to get the routes', () => {
    let updateFunc = null;
    const state = {};
    const history = [{ name: 'a', formId: 1 }, { name: 'b', formId: 2 }]
    routerSpy.routes = [ { name: 'a' }, { name: 'b' } ];

    storeSpy.getState.and.returnValue(state);
    getHistorySpy.and.returnValue(history);
    routerSpy.generate.and.returnValues('/a', '/b');
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({ form: 'a' });

    updateFunc();

    expect(getHistorySpy.calls.argsFor(0)[0]).toBe(state);
    expect(routerSpy.generate.calls.count()).toEqual(2);
    expect(routerSpy.generate).toHaveBeenCalledWith('a', { form: 1 });
    expect(routerSpy.generate).toHaveBeenCalledWith('b', { form: 2 });
    expect(sut.historyRoutes).toEqual([{
      name: 'a', formId: 1, url: '/a'
    }, {
      name: 'b', formId: 2, url: '/b'
    }])
  });

  it('does not generate routes when history does not exist', () => {
    let updateFunc = null;

    getHistorySpy.and.returnValue(null);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({ form: 'a' });

    updateFunc();

    expect(sut.historyRoutes).toEqual([]);
  });

  it('unsubscribes on deactivate', () => {
    let unsubscribe = false;
    const subscription = () => unsubscribe = true;

    // skip iterating over the history
    getHistorySpy.and.returnValue(null);
    storeSpy.subscribe.and.returnValue(subscription);
    sut.activate({ form: 'a' });

    sut.deactivate();

    expect(unsubscribe).toBeTruthy();
  });
});
