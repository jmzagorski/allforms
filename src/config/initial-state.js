import { EventAggregator } from 'aurelia-event-aggregator';
import { Store } from 'aurelia-redux-plugin';
import { requestCurrentMember, requestMemberForm } from '../domain';

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
      this._setForm.bind(this)
    );
  }

  _setForm(event) {
    const formName = event.instruction.params.formName;
    const memberId = event.instruction.params.memberId;

    if (formName && memberId) {
      this._store.dispatch(requestMemberForm(memberId, formName));
    }
  }
}
