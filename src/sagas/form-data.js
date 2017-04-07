import { put, takeLatest, call } from 'redux-saga/effects';
import * as actions from '../domain/form-data/actions';

/**
 * @summary calls the api to get the IFormData and dispatches return message
 */
export function* getFormDataAsync(api, action) {
  try {
    const formData = yield call([ api, api.get ], action.payload.formDataId);

    yield put(actions.receivedFormData(formData));
  } catch (e) {
    yield put(actions.receivedFormData(e, true));
  }
}

/**
 * @summary calls the api to create a new IFormData object and dispatches the
 * return message
 */
export function* createFormDataAsync(api, action) {
  try {
    const formData = yield call([ api, api.save ], action.payload);

    yield put(actions.formDataCreated(formData));
  } catch (e) {
    yield put(actions.formDataCreated(e, true));
  }
}

/**
 * @summary calls the api to edit a an existing IFormData object and dispatches the
 * return message
 */
export function* editFormDataAsync(api, action) {
  try {
    const formData = yield call([ api, api.save ], action.payload);

    yield put(actions.formDataEdited(formData));
  } catch (e) {
    yield put(actions.formDataEdited(e, true));
  }
}

/**
 * @summary Listens for form data actions
 * @param {IFormDataApi} api IFormDataApi interface
 */
export default function* formDataSaga(api) {
  yield takeLatest(actions.REQUEST_FORM_DATA, getFormDataAsync, api);
  yield takeLatest(actions.CREATE_FORM_DATA, createFormDataAsync, api);
  yield takeLatest(actions.EDIT_FORM_DATA, editFormDataAsync, api);
}
