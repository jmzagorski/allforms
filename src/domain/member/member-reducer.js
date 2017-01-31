import {LOAD_MEMBER_SUCCESS} from './member-actions';

export default function memberReducer(state = { }, action) {
  switch (action.type) {
    case LOAD_MEMBER_SUCCESS:
      return action.member;
    default:
      return state;
  }
}
