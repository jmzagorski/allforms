import { put, takeLatest, call } from 'redux-saga/effects';
import * as actions from '../domain/element/actions'

/**
 * @summary calls to get a single IElement object
 * @param {IElementApi} api the IElementApi service
 * @param {IAction} action the IAction that called the saga
 * @return {Iterator} an iterator that describes the transcation
 */
export function* getElement(api, action) {
  try {

    const element = yield call([api, api.get], action.payload.id);
    const hasError = !element;

    yield put(actions.receivedElement(element, hasError));

  } catch(e) {

    yield put(actions.receivedElement(e, true));
  }
}

/**
 * @summary calls to save a new element
 * @param {IElementApi} api the IElementApi service
 * @param {IAction} action the IAction that called the saga
 * @return {Iterator} an iterator that describes the transcation
 */
export function* addElement(api, action) {
  try {

    const element = yield call([api, api.save], action.payload);

    yield put(actions.elementAdded(element));

  } catch(e) {

    yield put(actions.elementAdded(e, true));
  }
}

/**
 * @summary calls to edit an existing element
 * @param {IElementApi} api the IElementApi service
 * @param {IAction} action the IAction that called the saga
 * @return {Iterator} an iterator that describes the transcation
 */
export function* editElement(api, action) {
  try {

    const element = yield call([api, api.save], action.payload);

    yield put(actions.elementEdited(element));

  } catch(e) {

    yield put(actions.elementEdited(e, true));
  }
}

/**
 * @summary Watches for element actions
 * @param {IElementApi} api the IElementApi service
 */
export default function* elementSaga(api) {
  yield takeLatest(actions.REQUEST_ELEMENT, getElement, api);
  yield takeLatest(actions.CREATE_ELEMENT, addElement, api);
  yield takeLatest(actions.EDIT_ELEMENT, editElement, api);
}
