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
    this.newModel = null;
    this.views = [ 'metadata', 'formulas' ];
    this.currentView = this.views[0];

    this._dialog = dialog;
    this._store = store;
    this._elementActions = elementActions;
  }

  get _state() {
    return this._store.getState();
  }

  get element() {
    return getActiveElement(this._state);
  }
  /**
   * @summary activates the dialog
   * @desc activates the dialog by loading or creating an element object
   * @param {Object} model an object who has a type property and optional id
   * @return {Promise<void>} a promise to activate the view
   */
  async activate(model) {
    const form = getActiveForm(this._state);
    await this._elementActions.loadElement(model.id);

    this.newModel = Object.assign({},
      { formStyle: form.style },
      { elementType: model.type },
      this.element,
      { formId: form.id }
    );
  }

  switchView(view) {
    this.currentView = view;
  }

  async submit() {
    await this._elementActions.saveElement(this.newModel);
    await this._dialog.ok(Object.assign(this.newModel, this.element));
  }

  cancel = async () => await this._dialog.cancel();
}
