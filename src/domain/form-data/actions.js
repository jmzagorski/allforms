export const REQUEST_FORM_DATA_LIST = 'REQUEST_FORM_DATA_LIST';
export const RECEIVED_FORM_DATA_LIST = 'RECEIVED_FORM_DATA_LIST';
export const REQUEST_FORM_DATA = 'REQUEST_FORM_DATA';
export const RECEIVED_FORM_DATA = 'RECEIVED_FORM_DATA';
export const CREATE_FORM_DATA = 'CREATE_FORM_DATA';
export const EDIT_FORM_DATA = 'EDIT_FORM_DATA';
export const FORM_DATA_CREATED = 'FORM_DATA_CREATED';
export const FORM_DATA_EDITED = 'FORM_DATA_EDITED';

export function requestFormDataList(formId) {
  return {
    type: REQUEST_FORM_DATA_LIST,
    payload: { formId }
  }
}

export function receivedFormDataList(data, hasError) {
  return {
    type: RECEIVED_FORM_DATA_LIST,
    payload: data,
    error: hasError
  }
}

export function requestFormData(formDataId) {
  return {
    type: REQUEST_FORM_DATA,
    payload: { formDataId }
  }
}

export function receivedFormData(formData, hasError) {
  return {
    type: RECEIVED_FORM_DATA,
    payload: formData,
    error: hasError
  }
}

export function createFormData(data) {
  return {
    type: CREATE_FORM_DATA,
    payload: data
  }
}

export function formDataCreated(data, hasError) {
  return {
    type: FORM_DATA_CREATED,
    payload: data,
    error: hasError
  }
}

export function editFormData(data) {
  return {
    type: EDIT_FORM_DATA,
    payload: data
  }
}

export function formDataEdited(data, hasError) {
  return {
    type: FORM_DATA_EDITED,
    payload: data,
    error: hasError
  }
}
