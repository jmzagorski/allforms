import { put, take, call, fork } from 'redux-saga/effects';
import { RECEIVED_FORM } from '../domain';
import * as actions from '../domain/metadata/actions';

/**
 * @summary calls to get the metadata
 * @param {IMetadataApi} api the IMetadataApi service
 * @param {IAction} action the IAction that called the saga
 * @return {Iterator} an iterator that describes the transcation
 */
export function* getMetadata(api, action) {
  try {
    // FIXME: bug in generate. Generator reverses this logic?
    if (!action.payload.metadata) {
      const metadata = yield call([api, api.get],
        action.payload.api,
        action.payload.id
      );

      const hasError = !metadata;

      yield put(actions.receivedMetadata(metadata, hasError));
    }
  } catch (e) {
    yield put(actions.receivedMetadata(e, true));
  }
}

/**
 * @summary Watches for metadata actions
 * @param {IMetadataApi} api the IMetadataApi service
 */
export default function* metadataSaga(api) {
  while (true) {
    yield take(actions.REQUEST_METADATA);
    const form = yield take(RECEIVED_FORM)
    yield fork(getMetadata, api, form);
  }
}
