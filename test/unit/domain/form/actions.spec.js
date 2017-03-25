import { FormApi } from '../../../../src/api/form-api';
import { Store } from 'aurelia-redux-plugin';
import * as domain from '../../../../src/domain/index';
import { setupSpy } from '../../jasmine-helpers';
import using from 'jasmine-data-provider';

describe('the form actions', () => {
  var sut;
  var storeSpy;
  var apiSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    apiSpy = setupSpy('api', FormApi.prototype);
    sut = new domain.FormActions(apiSpy, storeSpy);
  });

  it('create an action to request a form', () => {
    const id = 1;
    const expected = {
      type: 'REQUEST_FORM',
      payload: { id }
    }

    const actual = domain.requestForm(id);

    expect(actual).toEqual(expected);
  });

  [ true, false ].forEach(error => {
    it('create an action for a received form', () => {
      const payload = {};
      const expected = {
        type: 'RECEIVED_FORM',
        payload,
        error
      }

      const actual = domain.receivedForm(payload, error);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(payload);
    });
  });

  it('create an action for a form being created', () => {
    const payload = {};
    const expected = {
      type: 'CREATE_FORM',
      payload
    }

    const actual = domain.createForm(payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toBe(payload);
  });

  [ true, false ].forEach(error => {
    it('create an action for an added form', () => {
      const payload = {};
      const expected = {
        type: 'FORM_CREATED',
        payload,
        error
      }

      const actual = domain.formAdded(payload, error);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(payload);
    });
  });

  it('create an action for a form being edited', () => {
    const payload = {};
    const expected = {
      type: 'EDIT_FORM',
      payload
    }

    const actual = domain.editForm(payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toBe(payload);
  });

  [ true, false ].forEach(error => {
    it('create an action for an edited form', () => {
      const payload = {};
      const expected = {
        type: 'FORM_EDITED',
        payload,
        error
      }

      const actual = domain.formEdited(payload, error);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(payload);
    });
  });

  it('loads all the forms', async done => {
    const forms = [];

    apiSpy.get.and.returnValue(forms);

    await sut.loadForms();

    expect(storeSpy.dispatch).toHaveBeenCalledWith({
      type: 'LOAD_FORMS_SUCCESS', forms
    });
    expect(storeSpy.dispatch.calls.argsFor(0)[0].forms).toBe(forms);
    done();
  });

  [ { id: null, type: 'ADD_FORM_SUCCESS'},
    { id: undefined, type: 'ADD_FORM_SUCCESS'},
    { id: '', type: 'ADD_FORM_SUCCESS'},
    { id: 'a', type: 'EDIT_FORM_SUCCESS'}
  ].forEach(data => {
    it('adds the form if the id is not available', async done => {
      const form = { id: data.id };
      const serverForm = { };

      apiSpy.save.and.returnValue(serverForm);

      await sut.saveForm(form);

      expect(apiSpy.save).toHaveBeenCalledWith(form);
      expect(storeSpy.dispatch).toHaveBeenCalledWith({
        type: data.type, form: serverForm
      });
      expect(storeSpy.dispatch.calls.argsFor(0)[0].form).toBe(serverForm);
      done();
    });
  });

  it('has a form activated action', () => {
    const action = domain.activateFormSuccess('a');

    expect(action).toEqual({
      type: 'ACTIVATE_FORM_SUCCESS',
      id: 'a'
    });
  })
});
