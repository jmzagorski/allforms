import { put, takeLatest, call } from 'redux-saga/effects';
import * as actions from '../domain/member/actions';

/**
 * @summary calls the api to get the current IMember object
 * and dispatches return message
 */
export function* getCurrentMember(api, action) {
  try {
    const member = yield call([ api, api.getCurrent ]);

    yield put(actions.receivedCurrentMember(member));
  } catch (e) {
    yield put(actions.receivedCurrentMember(e, true));
  }
}

/**
 * @summary Listens for member actions
 * @param {IMembeApi} api IMembeApi interface
 */
export default function* memberSaga(api) {
  yield takeLatest(actions.REQUEST_CURRENT_MEMBER, getCurrentMember, api);
}
