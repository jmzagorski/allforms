import { Store } from 'aurelia-redux-plugin';
import { DialogService } from 'aurelia-dialog';
import { MetadataDialog } from './metadata-dialog';
import {
  requestForm,
  editFormTemplate,
  requestElementTypes,
  getActiveForm,
  getElementTypes
} from './domain';

const DATA_BUILDER = 'data-builder';

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
    this._unsubscribe = this._store.subscribe(this._update.bind(this))
    this._store.dispatch(requestElementTypes())
    this._store.dispatch(requestForm(params.form))
  }

  /**
   * @summary creates or edits a form element
   * @param {Object} event event object that raised the function
   * @param {Object} event.builder function string instruction on how to create
   * the element
   * @param {Object} [event.detail] an existing event that raised this event
   * @param {Object} [event.detail.$elem] the element the event came from
   */
  async createElement(event) {
    const dialogModel = {
      builder: event.builder || event.detail.$elem.getAttribute(DATA_BUILDER),
      $elem: event.detail ? event.detail.$elem : null,
      style: this.style,
      formId: this.formId
    };

    const result = await this._dialogService.open({
      viewModel: MetadataDialog,
      model: dialogModel
    });

    if (!result.wasCancelled) {
      result.output.setAttribute(DATA_BUILDER, dialogModel.builder)
      this.savePosition({
        detail: {
          formHtml: this.html + result.output.outerHTML,
          elementHtml: result.output.outerHTML,
          elementId: result.output.id
        }
      });
    }
  }

  deactivate() {
    this._unsubscribe();
  }

  savePosition(event) {
    this._store.dispatch(editFormTemplate({
      form: {
        template: event.detail.formHtml,
        id: this.formId
      },
      element: {
        template: event.detail.elementHtml,
        id: event.detail.elementId
      }
    }));

    this._store.dispatch(requestForm(this.formId))
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
