export function getFormData(state) {
  return state.formData ? state.formData.current : null;
}

export function getDataFormList(state) {
  return state.formData ? state.formData.list : [];
}
