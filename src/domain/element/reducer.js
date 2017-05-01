import * as actions from './actions';

/**
 * @summary Listens and responds to element actions by creating or returning
 * the state
 */
export default function elementReducer(state = null, action) {
  switch (action.type) {
    case actions.DEFAULT_NEW_ELEMENT:
      return action.payload;

    case actions.RECEIVED_ELEMENT:
    case actions.ELEMENT_ADDED:
    case actions.ELEMENT_EDITED:
      if (action.error) return state;

      return action.payload;

    case actions.ELEMENT_DELETED:
      if (action.error) return state;

      return null;

    default:
      return state;
  }
}
