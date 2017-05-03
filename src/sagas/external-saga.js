import { put, takeEvery, call } from 'redux-saga/effects';
import { EDIT_DATA_ON_FORM } from '../domain';
import * as actions from '../domain/form-data/actions';

export function* saveLocal(api, action) {
  try {
    const data = yield call([api, api.saveData], action.payload.formDataId,
      action.payload.formData)

    const hasError = !data;

    yield put(actions.formDataEdited(data, hasError));
  } catch (e) {
    yield put(actions.formDataEdited(e, true));
  }
}

export function* saveExternal(api, action) {
  try {
    const data = yield call([api, api.send],
      'POST',
      action.payload.api,
      action.payload.formData
    );

    const hasError = !data;

    yield put(actions.postedExternalDataForm(action.payload.formDataId, data, hasError));
  } catch (e) {
    yield put(actions.postedExternalDataForm(e, true));
  }
}

function isLocal(action, env, isLocalRoute) {
  return action.type === EDIT_DATA_ON_FORM &&
    env.isLocalApi(action.payload.api) === isLocalRoute
}

/**
 * @summary Watches for external data form actions
 * @param {XmlHttpRequest} api the XmlHttpRequest interface
 */
export default function* externalSaga(formDataApi, xhr, env) {
  yield takeEvery(action => isLocal(action, env, true), saveLocal, formDataApi)
  yield takeEvery(action => isLocal(action, env, false), saveExternal, xhr)
}
