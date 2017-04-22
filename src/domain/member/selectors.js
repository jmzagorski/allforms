export function getActiveMember(state) {
  return state.member;
}

export function getLoginId(state) {
  return state.member ? state.member.id : '';
}
