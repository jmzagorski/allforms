import { put, takeLatest, call } from 'redux-saga/effects';
import * as actions from '../domain/element-type/actions';

export function* getAllElementTypes(api, action) {
  try {
    const elemTypes = yield call([api, api.getAll]);

    yield put(actions.receivedElementTypes(elemTypes));
  } catch (e) {
    yield put(actions.receivedElementTypes(e, true));
  }
}

/**
 * @summary Listens for element type actions
 * @param {IElementTypeApi} api the api interface to use
 */
export default function* elementTypeSaga(api) {
  yield takeLatest(actions.REQUEST_ELEMENT_TYPES, getAllElementTypes, api);
}
