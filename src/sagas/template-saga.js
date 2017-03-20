import { put, takeLatest, call } from 'redux-saga/effects';
import * as actions from '../domain/template/actions'

export function* getTemplate(api, action) {
  try {

    const template = yield call([api, api.get], action.payload.id);

    yield put(actions.receivedTemplate(template));

  } catch(e) {

    yield put(actions.receivedTemplate(e, true));
  }
}

export function* createTemplate(api, action) {
  try {

    const template = yield call([api, api.add], action.payload);

    yield put(actions.templateCreated(template));
  } catch(e) {

    yield put(actions.templateCreated(e, true));
  }
}

export function* editTemplate(api, action) {
  try {

    const template = yield call([api, api.edit], action.payload);

    yield put(actions.templateEdited(template));
  } catch(e) {

    yield put(actions.templateEdited(e, true));
  }
}

/*
 * @summary Listens for template actions
 * @param {ITemplateApi} api the api interface to use
 */
export default function* templateSaga(api) {
  yield takeLatest(actions.REQUEST_TEMPLATE, getTemplate, api);
  yield takeLatest(actions.CREATE_TEMPLATE, createTemplate, api);
  yield takeLatest(actions.EDIT_TEMPLATE, editTemplate, api);
}
