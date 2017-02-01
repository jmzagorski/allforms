import { FormApi } from '../../api/form-api';
import { Store } from 'aurelia-redux-plugin';

export const LOAD_FORMS_SUCCESS = 'LOAD_FORMS_SUCCESS';
export const ADD_FORM_SUCCESS = 'ADD_FORM_SUCCESS';
export const EDIT_FORM_SUCCESS = 'EDIT_FORM_SUCCESS';
export const ACTIVATE_FORM_SUCCESS = 'ACTIVATE_FORM_SUCCESS';

function loadFormsSuccess(forms) {
  return { type: LOAD_FORMS_SUCCESS, forms };
}

function addFormSuccess(form) {
  return { type: ADD_FORM_SUCCESS, form };
}

function editFormSuccess(form) {
  return { type: EDIT_FORM_SUCCESS, form };
}

export function activateFormSuccess(name) {
  return { type: ACTIVATE_FORM_SUCCESS, name };
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
    const forms = await this._api.getAll();

    this._store.dispatch(loadFormsSuccess(forms));
  }

  /**
   * @desc Saves the form and dispatches the new form in a success event
   * @param {Form} form the form object
   *
   */
  async saveForm(form) {
    const serverVersion = await this._api.save(form);

    form.name ? this._store.dispatch(editFormSuccess(serverVersion)) :
      this._store.dispatch(addFormSuccess(serverVersion));
  }
}
