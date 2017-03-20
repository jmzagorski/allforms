import { Router } from 'aurelia-router';
import { Store } from 'aurelia-redux-plugin';
import { DataNew } from '../../src/data-new';
import { setupSpy } from './jasmine-helpers';
import { createFormData } from '../../src/domain/index';

describe('the new data form view model', () => {
  let storeSpy;
  let routerSpy;
  let sut;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerSpy = setupSpy('router', Router.prototype);
    sut = new DataNew(storeSpy, routerSpy);
  });

  it('initializes the view model with default property values', () => {
    expect(sut.model).not.toEqual(null);
  });

  it('gets the form id from params on activate', () => {
    const params = { form: 1 };

    sut.activate(params);

    expect(sut.model.formId).toEqual(params.form);
  });

  it('dispatches an event to create the new form', () => {
    const params = { form: 1 };

    sut.create();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(createFormData(sut.model));
  });

  it('navigates back to the form data list after creating a new one', () => {
    sut.model.formId = 1;

    sut.create();

    expect(routerSpy.navigateToRoute).toHaveBeenCalledWith('data', { form: 1 });
  });
});
