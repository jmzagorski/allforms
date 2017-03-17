import { MemberApi } from '../../api/member-api';
import { Store } from 'aurelia-redux-plugin';

export const LOAD_MEMBER_SUCCESS = 'LOAD_MEMBER_SUCCESS';

function loadMemberSuccess(member) {
  return { type: LOAD_MEMBER_SUCCESS, member };
}

export class MemberActions {
  static inject() { return [MemberApi, Store]; }

  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  /**
   * @desc Gets the member and dispatches that object in a success event
   *
   */
  async loadMember() {
    const member = await this._api.getCurrent();

    this._store.dispatch(loadMemberSuccess(member));
  }
}
