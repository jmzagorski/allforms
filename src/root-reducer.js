import { combineReducers } from 'redux';
import member from './domain/member/member-reducer';
import forms from './domain/form/form-reducer';
import elements from './domain/element/element-reducer';
import elementTypes from './domain/element-type/element-type-reducer';
import template from './domain/template/template-reducer';

export default combineReducers({
  member,
  forms,
  elements,
  elementTypes,
  template
});
