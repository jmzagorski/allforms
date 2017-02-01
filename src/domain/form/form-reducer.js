import {
  LOAD_FORMS_SUCCESS,
  ACTIVATE_FORM_SUCCESS
} from './form-actions';

export default function formReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_FORMS_SUCCESS:
      return Object.assign({}, state, { list: action.forms });

    case ACTIVATE_FORM_SUCCESS:
      return Object.assign({}, state, {
        active: action.name
      });

    default:
      return state;
  }
}
