export function getOverallMetadataStatus(state) {
  return !state.metadata ? '' : state.metadata.status;
}

export function getAllMetadataStatuses(state) {
  return !state.metadata ? null : state.metadata.statuses;
}
