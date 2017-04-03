import creator from './elements/factory';
import { Store } from 'aurelia-redux-plugin';
import { DialogController } from 'aurelia-dialog';
import {
  getActiveElement,
  createElement,
  requestElement,
  editElement,
  defaultNewElement
} from './domain/index';

export class MetadataDialog {
  static inject() { return [ DialogController, Store ]; }

  constructor(dialog, store) {
    this.model = {};
    this.schemas = [];

    this._$elem = {};
    this._unsubscribes = [];
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
   * @summary activates the dialog by loading or creating an IElement object
   * @param {Object} event the event object that called the dialog
   * @param {Object} event.builder the type of element to build
   * @param {Object} event.style the form style associated with the event
   * @param {Object} event.formId the form the element will be created on
   * @param {Object} [event.$elem] the existing dom element
   */
  activate(event) {
    this.model = creator(event.style, event.builder);
    this.model.formId = event.formId;
    this.model.schema.forEach(view => this.schemas.push(`./elements/views/${view}`));
    Object.assign(this.model, event);

    this._unsubscribes.push(this._store.subscribe(this._update.bind(this)));
    this._store.dispatch(defaultNewElement(this.model));

    if (event.$elem) this._store.dispatch(requestElement(event.$elem.id));
  }

  submit() {
    let actionCreator;

    if (!this.model.$elem) {
      this._$elem = this.model.create();
      actionCreator = createElement;
    } else {
      this._$elem = this.model.mutate ? this.model.mutate(this.model.$elem) :
        this.model.create(this.model.$elem);

      actionCreator = editElement;
    }

    // wait for the store to update to automatically signal ok
    this._unsubscribes.push(this._store.subscribe(async () => await this._ok()));
    this._store.dispatch(actionCreator(this.model));
  }

  async cancel() {
    await this._dialog.cancel();
  }

  deactivate() {
    for (let u of this._unsubscribes) u();
  }

  // the element needs an id before proceeding!
  async _ok() {
    if (this.element && this.element.id) {
      this._$elem.id = this.element.id;
      await this._dialog.ok(this._$elem);
    }
  }
  
  _update() {
    if (this.element) {
      Object.assign(this.model, this.element);
    }
  }
}
