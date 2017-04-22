import { EventAggregator } from 'aurelia-event-aggregator';
import { Store } from 'aurelia-redux-plugin';
import { requestCurrentMember, requestForm } from '../domain';

/**
 * @desc Loads the initial store state by loading data needed to get the app
 * started
 */
export default class {

  static inject() { return [ Store, EventAggregator ]; }

  constructor(store, eventAggregator) {
    this._store = store;
    this._eventAggregator = eventAggregator;
  }

  configure() {
    this._store.dispatch(requestCurrentMember());

    // subscribe for the lifetime of the app
    this._eventAggregator.subscribe(
      'router:navigation:processing',
      this.setActiveForm.bind(this)
    );
  }

  setActiveForm(event) {
    const form = event.instruction.params.form;

    if (form) {
      this._store.dispatch(requestForm(form));
    }
  }
}
