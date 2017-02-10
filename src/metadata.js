import { DialogController } from 'aurelia-dialog';
import { Store } from 'aurelia-redux-plugin';
import {
  ElementActions,
  getActiveForm,
  getActiveElement
} from './domain/index';
import * as schemas from './schemas/index';

export class Metadata {
  static inject() { return [ ElementActions, DialogController, Store ]; }

  constructor(elementActions, dialog, store) {
    this.elemForm = {
      schema: null,
      data: {}
    };
    this._form = null;
    this._options = {};
    this._element = {};
    this._type = null;
    this._dialog = dialog;
    this._store = store;
    this._elementActions = elementActions;
  }

  /**
   * @desc activates the dialog
   * @param {Object} model the model with the element type and an optional id if
   * the element already exists
   * @return {Promise<void>} a promise to activate the view
   */
  async activate(model) {
    this._form = getActiveForm(this._store.getState());
    this.elemForm.schema = schemas[this._form.style][model.type];
    this._type = model.type;

    if (model.id) {
      await this._elementActions.loadElement(model.id);
      this._element = getActiveElement(this._store.getState());
    } else {
      this._element = await this._createDefaultElement();
      // TODO only need one, but JSON server needs two right now
      this._element.formName = this._form.name;
      this._element.formId = this._form.name;
    }

    this.elemForm.data = this._element;
  }

  async submit() {
    await this._elementActions.saveElement(this.elemForm.data);
    await this._dialog.ok(this._element);
  }

  cancel = async () => await this._dialog.cancel();

  async _createDefaultElement() {
    if (!this._options[this._type]) {
      this._options[this._type] = {};

      for (let option of this.elemForm.schema) {
        this._options[this._type][option.key] = option.default;
      }
    }

    return Promise.resolve(this._options[this._type]);
  }
}
