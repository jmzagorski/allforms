import * as types from './form-actions';

export default function formReducer(state = [], action) {
  switch (action.type) {
    case types.LOAD_FORMS_SUCCESS:
      return action.forms;

    default:
      return state;
  }
}
