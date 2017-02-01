export function getActiveForm(state) {
  const form = state.forms.list.find(f => f.name == state.forms.active)
  form.files.sort((a, b) => a.priority - b.priority);
  return form;
}

export function getFormList(state) {
  return state.forms.list;
}
