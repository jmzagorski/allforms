import { App } from '../../src/app';
import { Store } from 'aurelia-redux-plugin';
import { setupSpy } from './jasmine-helpers';
import * as selectors from '../../src/domain/member/member-selectors';

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

    storeSpy.getState.and.returnValue({
      member: { loginName: 'joe' }
    });
  });

  it('configures the router client', async done => {
    await sut.activate();

    expect(routerConfFxSpy.calls.count()).toEqual(1);
    done();
  });

  it('configures the initial state', async done => {
    await sut.activate();

    expect(initialStateFxSpy.calls.count()).toEqual(1);
    done();
  });

  it('gets the member name', () => {
    const selectorSpy = spyOn(selectors, 'getActiveMember');
    const state = {};
    const member = {};
    storeSpy.getState.and.returnValue(state);
    selectorSpy.and.returnValue(member);

    const actualMember = sut.member;

    expect(selectorSpy.calls.argsFor(0)[0]).toBe(state);
    expect(sut.member).toBe(member);
  });
});
