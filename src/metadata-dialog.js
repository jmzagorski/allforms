import creator from './elements/factory';
import { Store } from 'aurelia-redux-plugin';
import { DialogController } from 'aurelia-dialog';
import {
  getActiveForm,
  creatingElement,
  getActiveElement,
  createElement,
  requestElement,
  editElement
} from './domain/index';

export class MetadataDialog {
  static inject() { return [ DialogController, Store ]; }

  constructor(dialog, store) {
    this.model = {};
    this.schemas = [];
    this.isNew = false;

    this._unsubscribe = null;
    this._dialog = dialog;
    this._store = store; 
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
   * @param {Object} element the IElement object
   * @return {Promise<void>} a promise to activate the view
   */
  activate(element) {
    const form = getActiveForm(this._state);
    this.model = creator(form.style, element.type);
    // always need this, it is the relationship to the form
    this.model.formId = form.id;
    this.model.schema.forEach(view => this.schemas.push(`./elements/views/${view}`));

    if (!element.id) {
      this.isNew = true;
      Object.assign(this.model, element);
      this._store.dispatch(creatingElement(this.model));
    } else {
      this._store.dispatch(requestElement(element.id));
      Object.assign(this.model, element, this.element);
    }
  }

  submit() {
    const actionCreator = this.isNew ? createElement : editElement;

    // wait for the store to update to automatically signal ok
    this._unsubscribe = this._store.subscribe(async () => await this._ok());

    this._store.dispatch(actionCreator(this.model));
  }

  async cancel() {
    await this._dialog.cancel();
  }

  deactivate() {
    if (this._unsubscribe) this._unsubscribe();
  }

  // the element needs an id before proceeding!
  async _ok() {
    if (this.element && this.element.id) {
      await this._dialog.ok(Object.assign(this.model, this.element));
    }
  }
}
