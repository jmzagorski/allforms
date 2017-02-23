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
    this.element = null;
    this.views = [ 'metadata', 'formulas' ];
    this.currentView = this.views[0];

    this._dialog = dialog;
    this._store = store;
    this._elementActions = elementActions;
  }

  /**
   * @desc activates the dialog
   * @param {Object} model the element object
   * @return {Promise<void>} a promise to activate the view
   */
  async activate(model) {
    const form = getActiveForm(this._store.getState());

    await this._elementActions.loadElement(model.id);
    this.element = getActiveElement(this._store.getState());

    if (!this.element) {
      //this.element = this._createDefaultElement(model.type);
      // TODO only need one, but JSON server needs two right now
      this.element = {
        formName: form.name,
        formId: form.name
      };
    }

    // view model properties only, no need to persist these
    this.element.type = model.type;
    this.element.style = form.style
  }

  switchView(view) {
    this.currentView = view;
  }

  async submit() {
    await this._elementActions.saveElement(this.element);
    await this._dialog.ok(this.element);
  }

  cancel = async () => await this._dialog.cancel();
}
