import { App } from '../../src/app';
import { Store } from 'aurelia-redux-plugin';
import { setupSpy } from './jasmine-helpers';
import * as selectors from '../../src/domain/member/selectors';

describe('the app view model', () => {
  let sut;
  let routerConfFxSpy;
  let routerSpy;
  let initialStateFxSpy;
  let storeSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerConfFxSpy = jasmine.createSpy('routerConf');
    initialStateFxSpy = jasmine.createSpy('initialState');
    routerSpy = { generate: jasmine.createSpy('routeGen') };

    sut = new App(
      { configure: routerConfFxSpy, router: routerSpy },
      { configure: initialStateFxSpy },
      storeSpy
    );
  });

  it('sets up the view model in the ctor', () => {
    expect(sut.login).toEqual(null);
    expect(sut.profileUrl).toEqual(null);
    expect(routerConfFxSpy.calls.count()).toEqual(1);
  });

  it('configures the initial state', async done => {
    await sut.activate();

    expect(initialStateFxSpy.calls.count()).toEqual(1);
    done();
  });

  it('gets the members login', async done => {
    const selectorSpy = spyOn(selectors, 'getLoginId');
    const state = {};
    let func = null;
    storeSpy.getState.and.returnValue(state);
    storeSpy.subscribe.and.callFake(fn => func = fn);
    selectorSpy.and.returnValue('a');

    await sut.activate();
    func();

    expect(selectorSpy.calls.argsFor(0)[0]).toBe(state);
    expect(sut.login).toEqual('a');
    done();
  });

  it('generates the member route from the login', async done => {
    const selectorSpy = spyOn(selectors, 'getLoginId');
    let func = null;
    storeSpy.subscribe.and.callFake(fn => func = fn);
    selectorSpy.and.returnValue('a');
    routerSpy.generate.and.returnValue('b');

    await sut.activate();
    func();

    expect(sut.profileUrl).toEqual('b');
    expect(routerSpy.generate).toHaveBeenCalledWith('member', { memberId: 'a' });
    done();
  });

  it('unsubscribes on deactivate', async done => {
    let unsubscribe = 0;
    const subscription = () => ++unsubscribe;

    storeSpy.subscribe.and.returnValues(subscription);
    await sut.activate({ });

    sut.deactivate();

    expect(unsubscribe).toEqual(1);
    done();
  });
});
