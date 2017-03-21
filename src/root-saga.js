import { default as elemTypeSaga } from './sagas/element-type';
import { default as elemSaga } from './sagas/element';
import { default as formDataSaga } from './sagas/form-data';
import { default as templateSaga } from './sagas/template-saga';
import * as apis from './api/index'

export default function setupRootSaga(http) {

  const elementApi = new apis.ElementApi(http);
  const elementTypeApi = new apis.ElementTypeApi(http);
  const formApi = new apis.FormApi(http);
  const formDataApi = new apis.FormDataApi(http);
  const formSettingsApi = new apis.FormSettingsApi(http);
  const memberApi = new apis.MemberApi(http);
  const templateApi = new apis.TemplateApi(http);

  return function*() {
    yield [
      elemTypeSaga(elementTypeApi),
      elemSaga(elementApi),
      formDataSaga(formDataApi),
      templateSaga(templateApi)
    ];
  }
}
