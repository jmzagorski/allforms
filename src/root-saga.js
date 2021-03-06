import { HttpClient } from 'aurelia-fetch-client';
import { default as elemTypeSaga } from './sagas/element-type';
import { default as elemSaga } from './sagas/element';
import { default as formDataSaga } from './sagas/form-data';
import { default as formSaga } from './sagas/form-saga';
import { default as metadataSaga } from './sagas/metadata-saga';
import { default as memberSaga } from './sagas/member-saga';
import { default as externalSaga } from './sagas/external-saga';
import * as apis from './api/index';

export default function setupRootSaga(http, envService) {
  const elementApi = new apis.ElementApi(http);
  const elementTypeApi = new apis.ElementTypeApi(http);
  const formApi = new apis.FormApi(http);
  const formDataApi = new apis.FormDataApi(http);
  const memberApi = new apis.MemberApi(http);
  // needs a new instance because these will be external calls
  const metadataApi = new apis.MetadataApi(new HttpClient());

  return function*() {
    yield [
      elemTypeSaga(elementTypeApi),
      elemSaga(elementApi),
      formDataSaga(formDataApi, new window.XMLHttpRequest(), envService),
      formSaga(formApi),
      metadataSaga(metadataApi),
      memberSaga(memberApi),
      // TODO logger for this
      externalSaga(formDataApi, new window.XMLHttpRequest(), envService)
    ];
  };
}
