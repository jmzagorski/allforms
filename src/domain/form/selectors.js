export function getActiveForm(state) {
  const form = state.forms.list.find(f => f.id === state.forms.active);
  form.files.sort((a, b) => a.priority - b.priority);
  return form;
}

export function getFormList(state) {
  return state.forms.list;
}

/**
 * @summary selects the active forms most recent history per file
 * @param {Object} state the state of the app
 * @return {Array<Object>} a new array with the forms most recent history
 *
 */
export function getRecentFormHistory(state) {
  const form = getActiveForm(state);

  return form.files
    .map(file => {
      return {
        name: file.name,
        formId: form.id,
        formName: form.name,
        comment: file.lastComment,
        revisedDays: file.lastEditInDays,
        icon: file.icon
      };
    });
}
