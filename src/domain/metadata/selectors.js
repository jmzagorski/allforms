export function getStatus(state) {
  return !state.metadata ? '' : state.metadata.status;
}

