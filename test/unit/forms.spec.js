import { Forms } from '../../src/forms';
import { Router } from 'aurelia-router';
import { Store } from '../../src/config/store';
import { setupSpy} from './jasmine-helpers';
import * as selectors from '../../src/domain/form/form-selectors';

describe('the forms view model', () => {
  let sut;
  let storeSpy;
  let routerSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerSpy = setupSpy('router', Router.prototype);
    sut = new Forms(routerSpy, storeSpy);
  });

  it('gets all the forms from the current state', () => {
    const expectForms = [ { id: 'b' } ];
    const state = [ { id: 'a' } ];
    const getFormsSpy = spyOn(selectors, 'getFormList');

    storeSpy.getState.and.returnValue(state);
    getFormsSpy.and.returnValue(expectForms);

    const actualForms = sut.forms;

    expect(actualForms).toBe(expectForms);
    expect(getFormsSpy).toHaveBeenCalledWith(state);
  });

  it('generates a route for each form', () => {
    const forms = [ { id: 'a' }, { id: 'b' }];
    spyOn(selectors, 'getFormList').and.returnValue(forms);

    sut.activate();

    expect(routerSpy.generate.calls.count()).toEqual(2);
    expect(routerSpy.generate).toHaveBeenCalledWith('dir', { form: 'a' });
    expect(routerSpy.generate).toHaveBeenCalledWith('dir', { form: 'b' });
  });
});
