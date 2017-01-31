import * as types from './element-actions';

/**
 * @desc Listens and responds to element action types by creating or returning
 * the origina state
 *
 */
export default function elementReducer(state = [ ], action) {
  switch (action.type) {
    case types.LOAD_ELEMENTS_SUCCESS:
      return action.elements;

    case types.ADD_ELEMENT_SUCCESS:
      return [
        ...state,
        Object.assign({}, action.element)
      ];

    case types.EDIT_ELEMENT_SUCCESS:
      return [
        ...state.filter(element => element.id !== action.element.id),
        Object.assign({}, action.element)
      ];

    default:
      return state;
  }
}
