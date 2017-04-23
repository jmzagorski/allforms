import { put, takeLatest, call } from 'redux-saga/effects';
import * as actions from '../domain/form/actions';
import { REQUEST_METADATA } from '../domain';

/**
 * @summary calls to get a single IForm object
 * @param {IFormApi} api the IFormApi service
 * @param {IAction} action the IAction that called the saga
 * @return {Iterator} an iterator that describes the transcation
 */
export function* getProfile(api, action) {
  try {
    const form = yield call([api, api.getProfile],
      action.payload.memberId, action.payload.formName);

    const hasError = !form;

    yield put(actions.receivedForm(form, hasError));
  } catch (e) {
    yield put(actions.receivedForm(e, true));
  }
}

/**
 * @summary calls to get a single IForm object
 * @param {IFormApi} api the IFormApi service
 * @param {IAction} action the IAction that called the saga
 * @return {Iterator} an iterator that describes the transcation
 */
export function* getForm(api, action) {
  try {
    // FIXME: bug in generate. Generator reverses this logic?
    if (action.payload.id) {
      const form = yield call([api, api.get], action.payload.id);
      const hasError = !form;

      yield put(actions.receivedForm(form, hasError));
    }
  } catch (e) {
    yield put(actions.receivedForm(e, true));
  }
}

/**
 * @summary calls to save a new form
 * @param {IFormApi} api the IFormApi service
 * @param {IAction} action the IAction that called the saga
 * @return {Iterator} an iterator that describes the transcation
 */
export function* addForm(api, action) {
  try {
    const form = yield call([api, api.save], action.payload);

    yield put(actions.formAdded(form));
  } catch (e) {
    yield put(actions.formAdded(e, true));
  }
}

/**
 * @summary calls to edit an existing form
 * @param {IFormApi} api the IFormApi service
 * @param {IAction} action the IAction that called the saga
 * @return {Iterator} an iterator that describes the transcation
 */
export function* editForm(api, action) {
  try {
    const form = yield call([api, api.save], action.payload);

    yield put(actions.formEdited(form));
  } catch (e) {
    yield put(actions.formEdited(e, true));
  }
}

export function* editTemplate(api, action) {
  try {
    const form = yield call([api, api.saveTemplate], action.payload.form);

    yield put(actions.formEdited(form));
  } catch (e) {
    yield put(actions.formEdited(e, true));
  }
}

/**
 * @summary Watches for form actions
 * @param {IFormApi} api the IFormApi service
 */
export default function* formSaga(api) {
  yield takeLatest(REQUEST_METADATA, getProfile, api);
  yield takeLatest(actions.REQUEST_FORM, getForm, api);
  yield takeLatest(actions.CREATE_FORM, addForm, api);
  yield takeLatest(actions.EDIT_FORM, editForm, api);
  yield takeLatest(actions.EDIT_FORM_TEMPLATE, editTemplate, api);
}
