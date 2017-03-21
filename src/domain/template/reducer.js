import * as actions from './actions';

export default function templateReducer(state = null, action) {
  switch (action.type) {
    case actions.RECEIVED_TEMPLATE:
      if (action.error) return state;

      return action.payload;

    case actions.TEMPLATE_CREATED:
    case actions.TEMPLATE_EDITED:
      return action.payload;

    default:
      return state;
  }
}
