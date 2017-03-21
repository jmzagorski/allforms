import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { MetadataDialog } from './metadata-dialog';
import { select } from 'redux-saga/effects';
import {
  requestTemplate,
  createTemplate,
  editTemplate,
  requestElementTypes,
  getTemplate,
  getActiveForm,
  getElementTypes
} from './domain/index';

export class Design {
  static inject() { return [ Store, DialogService ]; }

  constructor(store, dialogService) {
    this.html = '';
    this.style = null;
    this.designer = {};
    this.interactable = 'drag';

    this._isNewTemplate = false;
    this._store = store;
    this._dialogService = dialogService;
  }


  get elementTypes() {
    return getElementTypes(this._state);
  }

  get _template() {
    return getTemplate(this._state);
  }

  get _state() {
    return this._store.getState();
  }

  activate(params) {
    this._store.dispatch(requestElementTypes())
    this._store.dispatch(requestTemplate(params.form))

    const form = getActiveForm(this._state);

    this.html = this._template ? this._template.html : this.html;
    this.style = form.style;
    this.formId = form.id;
  }

  /**
   * @summary collects the metadata to render the element
   * @desc called either when creating a new element or when an existing element
   * needs to be edited
   * @param {Object} event custom event or element type builder function string
   * @interface event { detail: { model: { id: Number, type: String} } } |
   * { builder: String }
   *
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
    let action = null

    if (this._template) {
      action = editTemplate({
        id: this.formId,
        html: this.designer.element.innerHTML
      });
    } else {
      action = createTemplate({
        id: this.formId,
        html: this.designer.element.innerHTML
      });
    }

    debugger;
    this._store.dispatch(action);
  }
}
