import { default as elemTypeSaga } from './sagas/element-type';
import { default as elemSaga } from './sagas/element';
import { default as formDataSaga } from './sagas/form-data';
import { default as formSaga } from './sagas/form-saga';
import * as apis from './api/index';

export default function setupRootSaga(http) {
  const elementApi = new apis.ElementApi(http);
  const elementTypeApi = new apis.ElementTypeApi(http);
  const formApi = new apis.FormApi(http);
  const formDataApi = new apis.FormDataApi(http);
  const memberApi = new apis.MemberApi(http);

  return function*() {
    yield [
      elemTypeSaga(elementTypeApi),
      elemSaga(elementApi),
      formDataSaga(formDataApi),
      formSaga(formApi)
    ];
  };
}
