import {
  MemberActions,
  FormActions
} from '../domain/index';

/**
 * @desc Loads the initial store state by loading data needed to get the app
 * started
 *
 */
export default class {

  static inject() { return [ MemberActions, FormActions ]; }

  constructor(memberActions, formActions) {
    this._memberActions = memberActions;
    this._formActions = formActions;
  }

  async configure() {
    await this._memberActions.loadMember();
    await this._formActions.loadForms();
  }
}
