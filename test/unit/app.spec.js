import { App } from '../../src/app';
import { Store } from 'aurelia-redux-plugin';
import { setupSpy } from './jasmine-helpers';
import * as selectors from '../../src/domain/member/selectors';

describe('the app view model', () => {
  let sut;
  let routerConfFxSpy;
  let initialStateFxSpy;
  let storeSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerConfFxSpy = jasmine.createSpy('routerConf');
    initialStateFxSpy = jasmine.createSpy('initialState');

    sut = new App(
      { configure: routerConfFxSpy },
      { configure: initialStateFxSpy },
      storeSpy
    );
  });

  it('configures the router client', () => {
    sut.activate();

    expect(routerConfFxSpy.calls.count()).toEqual(1);
  });

  it('configures the initial state', () => {
    sut.activate();

    expect(initialStateFxSpy.calls.count()).toEqual(1);
  });

  it('gets the members login', () => {
    const selectorSpy = spyOn(selectors, 'getLoginId');
    const state = {};
    let func = null;
    storeSpy.getState.and.returnValue(state);
    storeSpy.subscribe.and.callFake(fn => func = fn);
    selectorSpy.and.returnValue('a');

    sut.activate();
    func();

    expect(selectorSpy.calls.argsFor(0)[0]).toBe(state);
    expect(sut.login).toEqual('a');
  });
});
