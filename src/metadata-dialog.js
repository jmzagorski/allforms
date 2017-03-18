import creator from './elements/factory';
import { Store } from 'aurelia-redux-plugin';
import { DialogController } from 'aurelia-dialog';
import {
  ElementActions,
  getActiveForm,
  getActiveElement
} from './domain/index';

export class MetadataDialog {
  static inject() { return [ ElementActions, DialogController, Store ]; }

  constructor(elementActions, dialog, store) {
    this.model = {};
    this.schemas = [];

    this._dialog = dialog;
    this._store = store;
    this._elementActions = elementActions;
  }

  get element() {
    return getActiveElement(this._state);
  }

  get _state() {
    return this._store.getState();
  }

  /**
   * @summary activates the dialog
   * @desc activates the dialog by loading or creating an element object
   * @param {Object} model an object who has a type property and optional id
   * @return {Promise<void>} a promise to activate the view
   */
  async activate(model) {
    const form = getActiveForm(this._state);
    this.model = creator(form.style, model.type);

    // always need this, it is the relationship to the form
    this.model.formId = form.id;

    this.model.schema.forEach(view => this.schemas.push(`./elements/views/${view}`));

    await this._elementActions.loadElement(model.id);
    Object.assign(this.model, model, this.element);
  }

  async submit() {
    await this._elementActions.saveElement(this.model);
    await this._dialog.ok(Object.assign(this.model, this.element));
  }

  cancel = async () => await this._dialog.cancel();
}
