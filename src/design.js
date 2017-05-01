import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { MetadataDialog } from './metadata-dialog';
import {
  requestForm,
  editFormTemplate,
  requestElementTypes,
  getActiveForm,
  getElementTypes,
  deleteElement
} from './domain';

export class Design {
  static inject =  [ Store, DialogService ];

  constructor(store, dialogService) {
    this.formId = null;
    this.style = null;
    this.api = null;
    this.html = '';
    this.interactOptions = {
      dragOptions: {
        restriction: '#page-host',
        enabled: true
      },
      resize: false
    };

    this._store = store;
    this._dialogService = dialogService;
    this._unsubscribe = () => {};
  }

  // TODO remove from store
  get elementTypes() {
    return getElementTypes(this._state);
  }

  get _state() {
    return this._store.getState();
  }

  /**
   * @summary called by aurelia to activates the view model
   * @param {Object} params the request parameters
   */
  activate(params) {
    this._unsubscribe = this._store.subscribe(this._update.bind(this));
    this._store.dispatch(requestElementTypes());
  }

  /**
   * @summary creates or edits a form element
   * @param {string} builder function string instruction on how to create
   * the element
   */
  async createMetadata(event) {
    event.formId = this.formId;
    event.style = this.style;
    const result = await this._dialogService.open({
      viewModel: MetadataDialog,
      model: event
    });

    if (!result.wasCancelled) {
      this._saveLayout({
        formHtml: event.$form ? event.$form.outerHTML : this.html + result.output.outerHTML,
        $elem: result.output
      });
    }
  }

  async saveInteraction(event) {
    switch (event.detail.type) {
      case 'dblclick':
        await this.createMetadata({ $form: event.detail.$form, $elem: event.detail.$elem });
        break;
      case 'delete':
        this._store.dispatch(deleteElement(event.detail.$elem.id))
        this._store.dispatch(editFormTemplate({
          form: {
            template: event.detail.$form.outerHTML,
            id: this.formId
          }
        }));
        break;
      default:
        this._saveLayout({
          formHtml: event.detail.$form.outerHTML,
          $elem: event.detail.$elem
        });
    }
  }

  deactivate() {
    this._unsubscribe();
  }

  _saveLayout({ formHtml, $elem }) {
    this._store.dispatch(editFormTemplate({
      form: {
        template: formHtml,
        id: this.formId
      },
      element: {
        template: $elem.outerHTML,
        id: $elem.id
      }
    }));

    this._store.dispatch(requestForm(this.formId));
  }

  _update() {
    const form = getActiveForm(this._state);
    if (form) {
      this.formId = form.id;
      this.style = form.style;
      this.api = form.api;
      this.html = form.template || this.html;
    }
  }
}
