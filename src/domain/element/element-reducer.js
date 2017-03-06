import * as types from './element-actions';

/**
 * @desc Listens and responds to element action types by creating or returning
 * the origina state
 *
 */
export default function elementReducer(state = { list: [], active: null }, action) {
  switch (action.type) {
    case types.LOAD_ELEMENT_SUCCESS:
      const list = state ? state.list : [];

      return Object.assign({}, state, {
        active: action.element.id
      }, {
        list: [ ...list, action.element ]
      });

    case types.ADD_ELEMENT_SUCCESS:
      return Object.assign({}, state, {
        active: action.element.id
      }, {
        list: [ ...state.list, Object.assign({}, action.element) ]
      });

    case types.EDIT_ELEMENT_SUCCESS:
      return Object.assign({}, state, {
        list: [
          ...state.list.filter(elem => elem.id !== action.element.id),
          Object.assign({}, action.element)]
      });

    case types.ELEMENT_NOT_FOUND:
      return Object.assign({}, state, {
        active: null
      });

    default:
      return state;
  }
}
