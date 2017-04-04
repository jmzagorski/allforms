import { Store } from 'aurelia-redux-plugin';
import { DataEdit } from '../../src/data-edit';
import { setupSpy } from './jasmine-helpers';
import { requestForm } from '../../src/domain/index';
import * as selectors from '../../src/domain/form/selectors';

describe('edit data view model', () => {
  let storeSpy;
  let sut;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);

    sut = new DataEdit(storeSpy);

  });

  it('initialized default properties', () => {
    expect(sut.html).toEqual('');
    expect(sut.autoSaveOpts).toBeDefined();
  });

  it('dispatches the request action after subscribing', () => {
    const params = { form: 1 };

    storeSpy.subscribe.and.callFake(arg => {
      expect(storeSpy.dispatch).not.toHaveBeenCalled();
    });

    sut.activate(params);

    expect(storeSpy.subscribe).toHaveBeenCalled();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestForm(params.form));
  });

  it('sets the view model html to the form template if exists on subscribe', () => {
    const params = { formDataId: 1 };
    const state = {};
    const form = { template: 'a', api: 'b' };
    const getFormSpy = spyOn(selectors, 'getActiveForm').and.returnValue(form);
    let updateFunc = null;

    storeSpy.getState.and.returnValue(state);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);

    sut.activate(params);
    updateFunc();

    expect(getFormSpy.calls.count()).toEqual(1);
    expect(getFormSpy.calls.argsFor(0)[0]).toBe(state);
    expect(sut.html).toEqual('a');
    expect(sut.autoSaveOpts).toEqual({
      action: 'PATCH', api: 'b/1'
    });
  });

  [ null, undefined ].forEach(form => {
    it('does not set view model properties without a form', () => {
      const getFormSpy = spyOn(selectors, 'getActiveForm').and.returnValue(form);
      let updateFunc = null;

      storeSpy.subscribe.and.callFake(func => updateFunc = func);

      sut.activate({});
      updateFunc();

      expect(sut.html).toEqual('');
      expect(sut.autoSaveOpts).toEqual({});
    });
  });

  it('unsubscribes on deactivate', () => {
    let unsubscribe = false;
    const subscription = () => unsubscribe = true;
    storeSpy.subscribe.and.returnValue(subscription);
    sut.activate({ });

    sut.deactivate();

    expect(unsubscribe).toBeTruthy();
  });
})
