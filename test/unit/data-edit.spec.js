import { Store } from 'aurelia-redux-plugin';
import { DataEdit } from '../../src/data-edit';
import { setupSpy } from './jasmine-helpers';
import { requestForm, requestFormData } from '../../src/domain/index';
import * as formSelectors from '../../src/domain/form/selectors';
import * as dataSelectors from '../../src/domain/form-data/selectors';

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
    const params = { form: 1, formDataId: 2 };

    storeSpy.subscribe.and.callFake(arg => {
      expect(storeSpy.dispatch).not.toHaveBeenCalled();
    });

    sut.activate(params);

    expect(storeSpy.subscribe).toHaveBeenCalled();
    expect(storeSpy.dispatch.calls.count()).toEqual(2);
    expect(storeSpy.dispatch.calls.argsFor(0)).toEqual([ requestForm(params.form) ]);
    expect(storeSpy.dispatch.calls.argsFor(1)).toEqual([ requestFormData(params.formDataId) ]);
  });

  it('sets up the view mode propertiers if the form and data exist on update', () => {
    const state = {};
    const form = { template: 'a', api: 'b' };
    const formData = { data: 'c', id: 1 };
    const getFormSpy = spyOn(formSelectors, 'getActiveForm').and.returnValue(form);
    const getDataSpy = spyOn(dataSelectors, 'getFormData').and.returnValue(formData);
    let updateFunc = null;

    storeSpy.getState.and.returnValue(state);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);

    sut.activate({ formDataId: formData.id });
    updateFunc();

    expect(getFormSpy.calls.count()).toEqual(1);
    expect(getDataSpy.calls.count()).toEqual(1);
    expect(getFormSpy.calls.argsFor(0)[0]).toBe(state);
    expect(getDataSpy.calls.argsFor(0)[0]).toBe(state);
    expect(sut.html).toEqual('a');
    expect(sut.autoSaveOpts).toEqual({
      method: 'PATCH', dataId: 1, data: 'c'
    });
  });

  [ { form: null, formData: {} },
    { form: undefined, formData: {} },
    { form: {}, formData: null },
    { form: {}, formData: undefined },
  ].forEach(data => {
    it('does not set view model properties without a form', () => {
      spyOn(formSelectors, 'getActiveForm').and.returnValue(data.form);
      spyOn(dataSelectors, 'getFormData').and.returnValue(data.formData);
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
