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

  [ { form: null, expect: '' },
    { form: undefined, expect: '' },
    { form: { template: 'a' }, expect: 'a' }
  ].forEach(data => {
    it('sets the view model html to the form template if exists on subscribe', () => {
      const params = { form: 1 };
      const state = {};
      const getFormSpy = spyOn(selectors, 'getActiveForm').and
        .returnValue(data.form);
      let updateFunc = null;

      storeSpy.getState.and.returnValue(state);

      storeSpy.subscribe.and.callFake(func => updateFunc = func);

      sut.activate(params);
      updateFunc();

      expect(getFormSpy.calls.count()).toEqual(1);
      expect(getFormSpy.calls.argsFor(0)[0]).toBe(state);
      expect(sut.html).toEqual(data.expect);
    });
  });

  it('gets the form on every store subscribe call', () => {
    const params = { form: 1 };
    const getFormSpy = spyOn(selectors, 'getActiveForm');
    let updateFunc = null;

    storeSpy.subscribe.and.callFake(func => updateFunc = func);

    sut.activate(params);
    updateFunc();
    updateFunc();

    expect(getFormSpy.calls.count()).toEqual(2);
  });
})
