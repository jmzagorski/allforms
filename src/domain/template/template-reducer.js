import {
  LOAD_TEMPLATE_SUCCESS,
  ADD_TEMPLATE_SUCCESS
} from './template-actions';

export default function templateReducer(state = { }, action) {
  switch (action.type) {
    case LOAD_TEMPLATE_SUCCESS:
    case ADD_TEMPLATE_SUCCESS:
      return action.template;
    default:
      return state;
  }
}
