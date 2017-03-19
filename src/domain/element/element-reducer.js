import * as actions from './actions';

/**
 * @desc Listens and responds to element actions by creating or returning
 * the state
 */
export default function elementReducer(state = { list: [], active: null }, action) {
  switch (action.type) {
    // when creating an element the active element is not an element yet until
    // it runs ELEMENT_ADDED
    case actions.CREATING_ELEMENT:
        return Object.assign({}, state, {
          active: null
        });

    case actions.RECEIVED_ELEMENT:
      const list = state ? state.list : [];

      // if an error occurs on receiving make sure there is nothing in the
      // active property
      if (action.error) {
        return Object.assign({}, state, {
          active: null
        });
      }

      // make the received element active and add it to the list without
      // duplicating it (hence the filter)
      return Object.assign({}, state, { active: action.payload.id  }, {
        list: [
          ...list.filter(l => l.id !== action.payload.id),
          action.payload
        ]
      });

    // make the newly added element active and add it to the list
    case actions.ELEMENT_ADDED:
      if (action.error) return state;

      return Object.assign({}, state, { active: action.payload.id }, {
        list: [ ...state.list, Object.assign({}, action.payload) ]
      });

    case actions.ELEMENT_EDITED:
      if (action.error) return state;

      return Object.assign({}, state, {
        list: [
          ...state.list.filter(elem => elem.id !== action.payload.id),
          Object.assign({}, action.payload)]
      });

    default:
      return state;
  }
}
