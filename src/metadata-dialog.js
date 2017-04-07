import creator from './elements/factory';
import { Store } from 'aurelia-redux-plugin';
import { DialogController } from 'aurelia-dialog';
import {
  getActiveElement,
  createElement,
  requestElement,
  editElement,
  defaultNewElement
} from './domain';

export class MetadataDialog {
  static inject = [ DialogController, Store ];

  constructor(dialog, store) {
    this.model = {};
    this.schemas = [];

    this._dialog = dialog;
    this._store = store; 
    this._$elem = null;
    this._unsubscribes = [];
  }

  get _element() {
    return getActiveElement(this._store.getState()) || {};
  }

  /**
   * @summary activates the dialog by loading or creating an IElement object
   * @param {string} builder the type of element to build
   * @param {string} style the element style
   * @param {string} formId the form the element will be created on
   * @param {Element} [$elem] an optional existing dom element to mutate
   */
  activate({ builder, style, formId, $elem}) {
    this._setupDefaults(builder, style, formId, $elem);

    if ($elem) {
      // IMPORTANT: set this before subscribing since i am not null checking
      // this._$elem in the _update method
      this._$elem = $elem;
      this._unsubscribes.push(this._store.subscribe(this._update.bind(this)));
      this._store.dispatch(requestElement($elem.id));
    } 
  }

  submit() {
    const actionCreator = this.model.id ? editElement : createElement;
    this._$elem = this.model.create(this._$elem);
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
    if (this._element.id) {
      this._$elem.id = this._element.id;
      await this._dialog.ok(this._$elem);
    }
  }

  _setupDefaults(builder, style, formId, $elem) {
    if ($elem) {
      this.model.id = $elem.id;
    } else {
      this.model = creator(style, builder);
      this.model.formId = formId;
      this.model.builder = builder;
      this.model.style = style;
      this._generateSchemas();
      this._store.dispatch(defaultNewElement(this.model));
    }
  }

  _update() {
    // wait for the element to get on the state
    debugger;
    if (this._element.id == this._$elem.id) {
      this.model = creator(this._element.style, this._element.builder);
      Object.assign(this.model, this._element);
      this._generateSchemas();
    }
  }

  _generateSchemas() {
    this.schemas = [];
    this.model.schema.forEach(view => this.schemas.push(`./elements/views/${view}`));
  }
}
