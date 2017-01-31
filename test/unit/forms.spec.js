import './setup';
import { Forms } from '../../src/forms';
import { Router } from 'aurelia-router';
import { Store } from 'aurelia-redux-plugin';

describe('the forms view model', () => {
  let sut;
  let storeSpy;
  let routerSpy;

  beforeEach(() => {
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    routerSpy = jasmine.setupSpy('router', Router.prototype);
    sut = new Forms(routerSpy, storeSpy);

  });

  it('gets all the forms from the current state', () => {
    const forms = [];
    storeSpy.getState.and.returnValue({ forms });

    sut.activate();

    expect(sut.forms).toBe(forms);
  });

  it('generates a route for each form', () => {
    const forms = [ { name: 'a' }, { name: 'b' }];
    storeSpy.getState.and.returnValue({ forms });

    sut.activate();

    expect(routerSpy.generate.calls.count()).toEqual(2);
    expect(routerSpy.generate).toHaveBeenCalledWith('dir', { form: 'a' });
    expect(routerSpy.generate).toHaveBeenCalledWith('dir', { form: 'b' });
  });
});
