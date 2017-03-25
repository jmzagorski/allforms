export const REQUEST_FORM = 'REQUEST_FORM';
export const RECEIVED_FORM = 'RECEIVED_FORM';
export const CREATE_FORM = 'CREATE_FORM';
export const FORM_CREATED = 'FORM_CREATED';
export const EDIT_FORM = 'EDIT_FORM';
export const FORM_EDITED = 'FORM_EDITED';

export function requestForm(id) {
  return {
    type: REQUEST_FORM,
    payload: { id }
  };
}

export function receivedForm(data, hasError) {
  return {
    type: RECEIVED_FORM,
    payload: data,
    error: hasError
  };
}

export function createForm(form) {
  return {
    type: CREATE_FORM,
    payload: form
  }
}

export function formAdded(data, hasError) {
  return {
    type: FORM_CREATED,
    payload: data,
    error: hasError
  }
}

export function editForm(form) {
  return {
    type: EDIT_FORM,
    payload: form
  }
}

export function formEdited(data, hasError) {
  return {
    type: FORM_EDITED,
    payload: data,
    error: hasError
  }
}
