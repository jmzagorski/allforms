import { FormApi } from '../../api/form-api';
import { Store } from 'aurelia-redux-plugin';

export const REQUEST_FORM = 'REQUEST_FORM';
export const RECEIVED_FORM = 'RECEIVED_FORM';
export const CREATE_FORM = 'CREATE_FORM';
export const FORM_CREATED = 'FORM_CREATED';
export const EDIT_FORM = 'EDIT_FORM';
export const FORM_EDITED = 'FORM_EDITED';

export const LOAD_FORMS_SUCCESS = 'LOAD_FORMS_SUCCESS';
export const ADD_FORM_SUCCESS = 'ADD_FORM_SUCCESS';
export const EDIT_FORM_SUCCESS = 'EDIT_FORM_SUCCESS';
export const ACTIVATE_FORM_SUCCESS = 'ACTIVATE_FORM_SUCCESS';

export function requestForm(id) {
  return {
    type: REQUEST_FORM,
    payload: { id }
  };
}

export function receivedForm(data, hasError) {
  return {
    type: RECEIVED_FORM,
    payload: data,
    error: hasError
  };
}

export function createForm(form) {
  return {
    type: CREATE_FORM,
    payload: form
  }
}

export function formAdded(data, hasError) {
  return {
    type: FORM_CREATED,
    payload: data,
    error: hasError
  }
}

export function editForm(form) {
  return {
    type: EDIT_FORM,
    payload: form
  }
}

export function formEdited(data, hasError) {
  return {
    type: FORM_EDITED,
    payload: data,
    error: hasError
  }
}

function loadFormsSuccess(forms) {
  return { type: LOAD_FORMS_SUCCESS, forms };
}

function addFormSuccess(form) {
  return { type: ADD_FORM_SUCCESS, form };
}

function editFormSuccess(form) {
  return { type: EDIT_FORM_SUCCESS, form };
}

export function activateFormSuccess(id) {
  return { type: ACTIVATE_FORM_SUCCESS, id };
}

export class FormActions {
  static inject() { return [FormApi, Store]; }

  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  /**
   * @desc Gets all the forms and dispatches that array in a success event
   *
   */
  async loadForms() {
    const forms = await this._api.get();

    this._store.dispatch(loadFormsSuccess(forms));
  }

  /**
   * @desc Saves the form and dispatches the new form in a success event
   * @param {Form} form the form object
   *
   */
  async saveForm(form) {
    const serverVersion = await this._api.save(form);

    form.id ? this._store.dispatch(editFormSuccess(serverVersion)) :
      this._store.dispatch(addFormSuccess(serverVersion));
  }
}
