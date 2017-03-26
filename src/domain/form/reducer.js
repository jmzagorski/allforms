import * as actions from './actions';

export default function formReducer(state = {}, action) {
  switch (action.type) {
    // removes any current form from the state while request in action
    case actions.REQUEST_FORM:
      return null;
    case actions.RECEIVED_FORM:
    case actions.FORM_CREATED:
    case actions.FORM_EDITED:
      if (action.error) return state;

      return action.payload;

    case actions.EDIT_FORM:
    case actions.CREATE_FORM:
      return action.payload;

    case actions.EDIT_FORM_TEMPLATE:
      return Object.assign({}, state, { template: action.payload });

    default:
      return state;
  }
}
