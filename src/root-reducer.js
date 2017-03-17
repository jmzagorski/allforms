import { combineReducers } from 'redux';
import * as domain from './domain/index';

const rootReducer = combineReducers({
  member: domain.member,
  forms: domain.forms,
  elements: domain.elements,
  elementTypes: domain.elementTypes,
  template: domain.template
});

export default rootReducer;
