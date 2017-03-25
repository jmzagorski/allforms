import * as actions from './actions';

/**
 * @desc Listens and responds to element actions by creating or returning
 * the state
 */
export default function elementReducer(state = {}, action) {
  switch (action.type) {
    case actions.RECEIVED_ELEMENT:
    case actions.ELEMENT_ADDED:
    case actions.ELEMENT_EDITED:
      if (action.error) return state;

      return action.payload

    // during the create element request make sure the state is null because
    // an auto id needs to be grabbed from the server
    case actions.CREATE_ELEMENT:
      return null; 

    default:
      return state;
  }
}
