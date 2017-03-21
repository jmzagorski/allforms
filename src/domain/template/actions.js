export const REQUEST_TEMPLATE = 'REQUEST_TEMPLATE';
export const RECEIVED_TEMPLATE = 'RECEIVED_TEMPLATE';
export const CREATE_TEMPLATE = 'CREATE_TEMPLATE';
export const EDIT_TEMPLATE = 'EDIT_TEMPLATE';
export const TEMPLATE_CREATED = 'TEMPLATE_CREATED';
export const TEMPLATE_EDITED = 'TEMPLATE_EDITED';

export function requestTemplate(id) {
  return {
    type: REQUEST_TEMPLATE,
    payload: { id }
  }
}

export function receivedTemplate(data, hasError) {
  return {
    type: RECEIVED_TEMPLATE,
    payload: data,
    error: hasError
  }
}

export function createTemplate(data) {
  return {
    type: CREATE_TEMPLATE,
    payload: data
  }
}

export function editTemplate(data) {
  return {
    type: EDIT_TEMPLATE,
    payload: data
  }
}

export function templateCreated(data, hasError) {
  return {
    type: TEMPLATE_CREATED,
    payload: data,
    error: hasError
  }
}

export function templateEdited(data, hasError) {
  return {
    type: TEMPLATE_EDITED,
    payload: data,
    error: hasError
  }
}
