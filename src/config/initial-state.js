import { EventAggregator } from 'aurelia-event-aggregator';
import { Store } from 'aurelia-redux-plugin';
import { MemberApi } from '../api';
import { receivedCurrentMember, requestMemberForm } from '../domain';

/**
 * @desc Loads the initial store state by loading data needed to get the app
 * started
 */
export default class {

  static inject() { return [ Store, EventAggregator, MemberApi ]; }

  constructor(store, eventAggregator, memberApi) {
    this._store = store;
    this._eventAggregator = eventAggregator;
    this._memberApi = memberApi;
  }

  async configure() {
    // IMPORTANT, current member must be loaded before app starts so use
    // await/async
    const member = await this._memberApi.getCurrent();
    this._store.dispatch(receivedCurrentMember(member));

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
