import { combineReducers } from 'redux';
import * as domain from './domain/index';

const rootReducer = combineReducers({
  member: domain.member,
  form: domain.form,
  element: domain.element,
  elementTypes: domain.elementTypes,
  formData: domain.formData
});

export default rootReducer;
