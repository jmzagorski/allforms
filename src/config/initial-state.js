import { EventAggregator } from 'aurelia-event-aggregator';
import { Store } from './store';
import { MemberActions, FormActions, activateFormSuccess } from '../domain/index';

/**
 * @desc Loads the initial store state by loading data needed to get the app
 * started
 *
 */
export default class {

  static inject() { return [ Store, MemberActions, FormActions, EventAggregator ]; }

  constructor(store, memberActions, formActions, eventAggregator) {
    this._store = store;
    this._memberActions = memberActions;
    this._formActions = formActions;
    this._eventAggregator = eventAggregator;
  }

  async configure() {
    await this._memberActions.loadMember();
    await this._formActions.loadForms();

    // subscribe for the lifetime of the app
    this._eventAggregator.subscribe(
      'router:navigation:processing',
      this.setActiveForm.bind(this)
    );
  }

  setActiveForm(event) {
    const path = event.instruction.fragment.split('/');

    if (path.length > 1 && path[1] !== '') {
      this._store.dispatch(activateFormSuccess(path[1]));
    }
  }
}
