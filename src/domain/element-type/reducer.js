import * as actions from './actions';

/**
 * @summary Listens and responds to element type action types by creating or
 * returning the state
 */
export default function elementTypeReducer(state = [ ], action) {
  switch (action.type) {
    case actions.RECEIVED_ELEMENT_TYPES:
      return action.error ? [] : action.payload;

    default:
      return state;
  }
}
