import { Store } from 'aurelia-redux-plugin';
import { Settings } from '../../src/settings';
import { editForm, requestForm, createForm } from '../../src/domain/index';
import { Router } from 'aurelia-router';
import { setupSpy } from './jasmine-helpers';
import { PLATFORM } from 'aurelia-pal';
import * as selectors from '../../src/domain/form/selectors';
import * as env from '../../src/env';

describe('the form settings view model', () => {
  let sut;
  let storeSpy;
  let routerSpy;
  let baseUrlSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerSpy = setupSpy('router', Router.prototype);

    PLATFORM.location = 'loc';
    baseUrlSpy = spyOn(env, 'getBaseUrl').and.returnValue('base/');

    sut = new Settings(storeSpy, routerSpy);
  });

  it('initializes the view model with a model', () => {
    expect(baseUrlSpy).toHaveBeenCalledWith('loc');
    expect(sut.model).toEqual({ style: 'bootstrap', api: 'base/form-data' });
  });

  it('dispatches a request for the form on activate', () => {
    sut.activate({ form: 'a' });

    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestForm('a'));
  });

  it('listens for the form to create the model', () => {
    const form = { id: 'b', anything: 2, style: 'bootstrap', api: 'form-data' };
    const getFormSpy = spyOn(selectors, 'getActiveForm').and.returnValue(form);
    const state = {};
    let updateFunc = null;

    storeSpy.getState.and.returnValue(state);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({ form: 'a' });

    updateFunc();

    expect(getFormSpy.calls.argsFor(0)[0]).toBe(state);
    expect(sut.model).toEqual(form);
  });

  it('dispatches to create the form', () => {
    sut.activate({ });

    sut.configure();

    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(createForm(sut.model));
  });

  it('dispatches to edit the form', () => {
    sut.model = { id: 1 };
    sut.activate({ form: 'a' });

    sut.configure();

    expect(storeSpy.dispatch.calls.mostRecent().args[0]).toEqual(editForm(sut.model));
  });

  it('redirects after dispatching an edit', () => {
    sut.activate({ form: 'a' });

    sut.model.id = 1;

    storeSpy.dispatch.and.callFake(() => {
      expect(routerSpy.navigateToRoute.calls.count()).toEqual(0);
    });

    sut.configure();

    expect(routerSpy.navigateToRoute.calls.count()).toEqual(1);
    expect(routerSpy.navigateToRoute).toHaveBeenCalledWith('dir', { form: 1 })
  });

  it('redirects after dispatching a create', () => {
    sut.activate({ });

    storeSpy.dispatch.and.callFake(() => {
      expect(routerSpy.navigateToRoute.calls.count()).toEqual(0);
    });

    sut.configure();

    expect(routerSpy.navigateToRoute.calls.count()).toEqual(1);
    expect(routerSpy.navigateToRoute).toHaveBeenCalledWith('allforms')
  });

  it('unsubscribes on deactivate', () => {
    let unsubscribe = false;
    const subscription = () => unsubscribe = true;

    storeSpy.subscribe.and.returnValue(subscription);
    sut.activate({ form: 'a' });

    sut.deactivate();

    expect(unsubscribe).toBeTruthy();
  });
})
