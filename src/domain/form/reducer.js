import * as actions from './actions';

export default function formReducer(state = null, action) {
  switch (action.type) {
      // TODO temporary until fix bug
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

    default:
      return state;
  }
}
