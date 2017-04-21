import { Store } from 'aurelia-redux-plugin';
import { getAllMetadataStatuses, requestForm, requestMetadata } from './domain';

export class Interface {

  static inject = [ Store ]

  constructor(store) {
    this.gridOptions = {
      forceFitColumns: true
    };
    this.contextOptions = {
      contextIcon: 'fa fa-handshake-o'
    };
    this.statuses = [];

    this._store = store;
    this._unsubscribe = () => {};
  }

  async activate(params) {
    this._unsubscribe = this._store.subscribe(this._update.bind(this));
    // FIXME: shouldnt have to request the form and metadata. request for
    // metadatra should signal to make sure a form exists
    this._store.dispatch(requestForm(params.form));
    this._store.dispatch(requestMetadata(params.form));
  }

  _update() {
    this.statuses = getAllMetadataStatuses(this._store.getState());
  }

  deactivate() {
    this._unsubscribe();
  }
}
