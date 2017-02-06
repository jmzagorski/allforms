import * as types from './element-type-actions';

/**
 * @desc Listens and responds to element type action types by creating or returning
 * the original state
 */
export default function elementReducer(state = [ ], action) {
  switch (action.type) {
    case types.LOAD_ELEMENT_TYPES_SUCCESS:
      return action.elementTypes;

    default:
      return state;
  }
}
