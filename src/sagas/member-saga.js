import { put, takeLatest, call } from 'redux-saga/effects';
import * as actions from '../domain/member/actions';
import { receivedForms, receivedDataForms } from '../domain';

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

export function* getRecentForms(api, action) {
  try {
    const forms = yield call([ api, api.getRecentForms ], action.payload.memberId)

    yield put(receivedForms(forms));
  } catch (e) {
    yield put(receivedForms(e, true));
  }
}

export function* getRecentDataForms(api, action) {
  try {
    const dataForms = yield call([ api, api.getRecentDataForms ], action.payload.memberId);

    yield put(receivedDataForms(dataForms));
  } catch (e) {
    yield put(receivedDataForms(e, true));
  }
}

/**
 * @summary Listens for member actions
 * @param {IMembeApi} api IMembeApi interface
 */
export default function* memberSaga(api) {
  yield takeLatest(actions.REQUEST_CURRENT_MEMBER, getCurrentMember, api);
  yield takeLatest(actions.REQUEST_MEMBER_ACTIVITY, getRecentForms, api);
  yield takeLatest(actions.REQUEST_MEMBER_ACTIVITY, getRecentDataForms, api);
}
