import { Store } from 'aurelia-redux-plugin';
import { Settings } from '../../src/settings';
import { editForm, requestForm } from '../../src/domain/index';
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

  it('dispatches a request for the form on activate', () => {
    sut.activate({ form: 'a' });

    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestForm('a'));
  });

  it('listens for the form to create the model', () => {
    const form = { id: 'b', anything: 2 };
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

  it('dispatches to edit the form', () => {
    sut.model = { id: 1 };

    sut.configure();

    expect(storeSpy.dispatch.calls.count()).toEqual(1);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(editForm(sut.model));
  });

  it('redirects after dispatching to edit', () => {
    sut.model.id = 1;

    storeSpy.dispatch.and.callFake(() => {
      expect(routerSpy.navigateToRoute.calls.count()).toEqual(0);
    });

    sut.configure();

    expect(routerSpy.navigateToRoute.calls.count()).toEqual(1);
    expect(routerSpy.navigateToRoute).toHaveBeenCalledWith('dir', { form: 1 })
  });


  it('unsubscribes on deactivate', () => {
    let unsubscribe = false;
    const subscription = () => unsubscribe = true;

    // skip iterating over the history
    storeSpy.subscribe.and.returnValue(subscription);
    sut.activate({ form: 'a' });

    sut.deactivate();

    expect(unsubscribe).toBeTruthy();
  });
})
