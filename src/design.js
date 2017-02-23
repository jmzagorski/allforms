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

  interactable = 'drag';
  designer = {};
  elementTypes= [];
  html = '';
  style = null;

  constructor(store, elementTypeActions, dialogService, templateActions) {
    this._form = null;
    this._store = store;
    this._templateActions = templateActions;
    this._elementTypeActions = elementTypeActions;
    this._dialogService = dialogService;
  }

  async activate(params) {
    await this._elementTypeActions.loadAll();
    await this._templateActions.loadTemplateFor(params.form);

    const state = this._store.getState();
    const template = getTemplate(state);

    this._form = getActiveForm(state);
    this.style = this._form.style;
    this.html = template.html || this.html;
    this.elementTypes = getElementTypes(state);
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
      name: this._form.name,
      html: this.designer.element.innerHTML
    });
  }
}
