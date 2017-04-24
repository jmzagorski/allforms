import { Store } from 'aurelia-redux-plugin';
import { Settings } from '../../src/settings';
import { editForm, requestForm, createForm } from '../../src/domain/index';
import { Router } from 'aurelia-router';
import { setupSpy } from './jasmine-helpers';
import * as selectors from '../../src/domain/form/selectors';

describe('the form settings view model', () => {
  let sut;
  let storeSpy;
  let routerSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerSpy = setupSpy('router', Router.prototype);
    sut = new Settings(storeSpy, routerSpy);
  });

  it('initializes the view model with a model', () => {
    expect(sut.model).toEqual({ style: 'bootstrap' });
  });

  it('sets the route params as model properties', () => {
    const memberId = 1;
    const formName = 2;
    spyOn(selectors, 'getActiveForm').and.returnValue(null);

    sut.activate({ memberId, formName });

    expect(sut.model.name).toEqual(formName);
    expect(sut.model.memberId).toEqual(memberId);
  })

  it('listens for the form to create the model', () => {
    const form = { id: 'b', anything: 2, style: 'bootstrap', api: 'forms/data' };
    const getFormSpy = spyOn(selectors, 'getActiveForm').and.returnValue(form);
    const state = {};
    let updateFunc = null;

    sut.model.id = 'a'; // test the Object.assign

    storeSpy.getState.and.returnValue(state);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);

    sut = new Settings(storeSpy, routerSpy);

    updateFunc();

    expect(getFormSpy.calls.argsFor(0)[0]).toBe(state);
    expect(sut.model).toEqual(form);
  });

  it('updates the model on activate', () => {
    const form = {
      id: 'b',
      anything: 2,
      name: 'b',
      style: 'bootstrap',
      api: 'forms/data',
      memberId: 'a'
    };
    const getFormSpy = spyOn(selectors, 'getActiveForm').and.returnValue(form);

    sut.activate({ formName: 'b', memberId: 'a' });

    expect(sut.model).toEqual(form);
  });

  [ null, undefined ].forEach(form => {
    it('does not update the model if no form exists', () => {
      const getFormSpy = spyOn(selectors, 'getActiveForm').and.returnValue(form);

      sut.activate({ formName: 1, memberId: 'a' });

      expect(sut.model).toEqual({ style: 'bootstrap', name: 1, memberId: 'a' });
    });
  });

  it('dispatches to create the form', () => {
    sut.activate({ });

    sut.configure();

    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(createForm(sut.model));
  });

  it('dispatches to edit the form', () => {
    sut.model = { id: 1 };
    spyOn(selectors, 'getActiveForm').and.returnValue(null);

    sut.activate({ formName: 'a' });

    sut.configure();

    expect(storeSpy.dispatch.calls.mostRecent().args[0]).toEqual(editForm(sut.model));
  });

  [ { modelId: null, route: 'member', param: { memberId: 'a' } },
    { modelId: undefined, route: 'member', param: { memberId: 'a' } },
    { modelId: 1, route: 'dir', param: { memberId: 'a', formName: 'b' } }
  ].forEach(rec => {
    it('redirects after dispatching an edit', () => {
      sut.model.id = rec.modelId;

      storeSpy.dispatch.and.callFake(() => {
        expect(routerSpy.navigateToRoute.calls.count()).toEqual(0);
      });

      sut.activate({})

      sut.model.memberId = 'a';
      sut.model.name = 'b';

      sut.configure();

      expect(routerSpy.navigateToRoute.calls.count()).toEqual(1);
      expect(routerSpy.navigateToRoute).toHaveBeenCalledWith(rec.route, rec.param);
    });
  });

  it('unsubscribes on deactivate', () => {
    let unsubscribe = false;
    const subscription = () => unsubscribe = true;
    storeSpy.subscribe.and.returnValue(subscription);

    sut = new Settings(storeSpy, routerSpy);
    sut.activate({ form: 'a' });

    sut.deactivate();

    expect(unsubscribe).toBeTruthy();
  });
})
