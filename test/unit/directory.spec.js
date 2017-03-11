import { Store } from '../../src/config/store';
import { Directory } from '../../src/directory';
import { Router } from 'aurelia-router';
import { setupSpy } from './jasmine-helpers';
import * as selectors from '../../src/domain/form/form-selectors';

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

  it('gets the form history', () => {
    const state = {};
    const history = [];
    storeSpy.getState.and.returnValue(state);
    getHistorySpy.and.returnValue(history);

    const actualHistory = sut.history;

    expect(getHistorySpy.calls.argsFor(0)[0]).toBe(state);
    expect(actualHistory).toBe(history);
  });

  it('generates a route for every history object', () => {
    const history = [{ name: 'a', formId: 1 }, { name: 'b', formId: 2 }]
    routerSpy.routes = [ { name: 'a' }, { name: 'b' } ];

    getHistorySpy.and.returnValue(history);
    routerSpy.generate.and.returnValues('/a', '/b');

    sut.activate(params);

    expect(routerSpy.generate.calls.count()).toEqual(2);
    expect(routerSpy.generate).toHaveBeenCalledWith('a', { form: 1 });
    expect(routerSpy.generate).toHaveBeenCalledWith('b', { form: 2 });
    expect(sut.historyRoutes).toEqual([{
      name: 'a', formId: 1, url: '/a'
    }, {
      name: 'b', formId: 2, url: '/b'
    }])
  });
});
