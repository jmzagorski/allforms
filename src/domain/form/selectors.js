export function getActiveForm(state) {
  const form = state.form;

  if (!form) return null;

  form.files.sort((a, b) => a.priority - b.priority);

  return form;
}

/**
 * @summary selects the active forms most recent history per file
 * @param {Object} state the state of the app
 * @return {Array<Object>} a new array with the forms most recent history
 *
 */
export function getRecentFormHistory(state) {
  const form = getActiveForm(state);

  if (!form) return null;

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
