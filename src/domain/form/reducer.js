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

    default:
      return state;
  }
}
