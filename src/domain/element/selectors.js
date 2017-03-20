export function getElements(state) {
  return state.elements.list;
}

export function getActiveElement(state) {
  return state.elements.list.find(f => f.id === state.elements.active);
}
