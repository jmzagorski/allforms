import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { MetadataDialog } from './metadata-dialog';
import {
  TemplateActions,
  ElementTypeActions,
  getTemplate,
  getActiveForm,
  getElementTypes
} from './domain/index';

export class Design {
  static inject() { return [ Store, ElementTypeActions, DialogService, TemplateActions ]; }

  constructor(store, elementTypeActions, dialogService, templateActions) {
    this.html = '';
    this.style = null;
    this.designer = {};
    this.interactable = 'drag';

    this._store = store;
    this._templateActions = templateActions;
    this._elementTypeActions = elementTypeActions;
    this._dialogService = dialogService;
  }

  get _state() {
    return this._store.getState();
  }

  get elementTypes() {
    return getElementTypes(this._state);
  }

  async activate(params) {
    await this._elementTypeActions.loadAll();
    await this._templateActions.loadTemplateFor(params.form);

    const template = getTemplate(this._state);
    const form = getActiveForm(this._state);

    this.html = template.html || this.html;
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
      await this.saveTemplate();
    }
  }

  async saveTemplate() {
    this._templateActions.save({
      id: this.formId,
      html: this.designer.element.innerHTML
    });
  }
}
