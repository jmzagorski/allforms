import { EventAggregator } from 'aurelia-event-aggregator';
import { Store } from 'aurelia-redux-plugin';
import { MemberActions, requestForm } from '../domain/index';

/**
 * @desc Loads the initial store state by loading data needed to get the app
 * started
 */
export default class {

  static inject() { return [ Store, MemberActions, EventAggregator ]; }

  constructor(store, memberActions, eventAggregator) {
    this._store = store;
    this._memberActions = memberActions;
    this._eventAggregator = eventAggregator;
  }

  async configure() {
    await this._memberActions.loadMember();

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
