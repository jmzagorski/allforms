import * as actions from './actions';

export default function memberReducer(state = null, action) {
  switch (action.type) {
    case actions.RECEIVED_CURRENT_MEMBER:
      if (action.error) return state;

      return action.payload;
    default:
      return state;
  }
}
