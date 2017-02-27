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
    this.interactable = 'drag'

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
    this.formId = form.id;
    this.style = form.style;
  }

  async renderElement(elementType) {
    const model = { type: elementType.builder }
    const result = await this.setupMetadata({ detail: { model } });
    if (!result.wasCancelled) {
      this.designer.createElement(Object.assign({}, model, { options: result.output }));
    }
  }

  async setupMetadata(event) {
    return await this._dialogService.open({
      viewModel: MetadataDialog,
      model: event.detail.model
    });
  }

  async saveTemplate() {
    this._templateActions.save({
      id: this.formId,
      html: this.designer.element.innerHTML
    });
  }
}
