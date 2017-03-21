import {
  LOAD_TEMPLATE_SUCCESS,
  ADD_TEMPLATE_SUCCESS
} from './actions';

export default function templateReducer(state = null, action) {
  switch (action.type) {
    case LOAD_TEMPLATE_SUCCESS:
    case ADD_TEMPLATE_SUCCESS:
      return action.template;
    default:
      return state;
  }
}
