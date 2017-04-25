export function getActiveForm(state) {
  return state.form ? state.form.current : null;
}

export function getFormList(state) {
  return state.form ? state.form.list : [];
}
