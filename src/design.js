import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { MetadataDialog } from './metadata-dialog';
import {
  requestForm,
  editFormTemplate,
  requestElementTypes,
  getActiveForm,
  getElementTypes
} from './domain/index';

export class Design {
  static inject() { return [ Store, DialogService ]; }

  constructor(store, dialogService) {
    this.html = '';
    this.style = null;
    this.formId = null;
    this.designer = {};
    this.interactable = 'drag';

    this._store = store;
    this._dialogService = dialogService;
    this._unsubscribe = null;
  }

  get elementTypes() {
    return getElementTypes(this._state);
  }

  get _state() {
    return this._store.getState();
  }

  activate(params) {
    this._store.dispatch(requestElementTypes())
    this._store.dispatch(requestForm(params.form))
    this._unsubscribe = this._store.subscribe(this._update.bind(this))
  }

  /**
   * @summary collects the metadata to render the element
   * @desc called either when creating a new element or when an existing element
   * needs to be edited
   * @param {Object} event custom event or element type builder function string
   * @param {Object} event.detail.model.id: the model id on the detail object of
   * an event
   * @param {Object} event.detail.model.type: the element type to create
   * @param {Object} event.builder: the builder is the element type to create
   */
  async renderElement(event) {
    const model = event.detail ? event.detail.model : { type: event.builder };

    const result = await this._dialogService.open({
      viewModel: MetadataDialog,
      model
    });

    if (!result.wasCancelled) {
      this.designer.createElement(result.output);
      this.saveTemplate();
    }
  }

  saveTemplate() {
    const action = editFormTemplate(this.designer.element.innerHTML);

    this._store.dispatch(action);
  }

  deactivate() {
    if (this._unsubscribe) this._unsubscribe();
  }

  _update() {
    const form = getActiveForm(this._state);

    if (!form) return;

    this.style = form.style;
    this.formId = form.id;

    // i never want the html property to be undefined or that will be rendered
    // in the browser
    this.html = form.template || this.html;
  }
}
