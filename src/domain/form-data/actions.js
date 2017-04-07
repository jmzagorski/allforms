export const REQUEST_FORM_DATA = 'REQUEST_FORM_DATA';
export const RECEIVED_FORM_DATA = 'RECEIVED_FORM_DATA';
export const CREATE_FORM_DATA = 'CREATE_FORM_DATA';
export const EDIT_FORM_DATA = 'EDIT_FORM_DATA';
export const FORM_DATA_CREATED = 'FORM_DATA_CREATED';
export const FORM_DATA_EDITED = 'FORM_DATA_EDITED';

/**
 * @summary creates the action object for requesting the IFormData object
 * @param {Number} formDataId the unique id of the data form
 * @return {IAction} the IAction object
 */
export function requestFormData(formDataId) {
  return {
    type: REQUEST_FORM_DATA,
    payload: { formDataId }
  };
}

/**
 * @summary action creator for when the form is received from the server
 * @param {IFormData | Error} data the IFormData object or Error object
 * @param {Boolean} [hasError] a flag to indicate in the data arg is an error
 * @return {IAction} the action object
 */
export function receivedFormData(formData, hasError) {
  return {
    type: RECEIVED_FORM_DATA,
    payload: formData,
    error: hasError
  };
}

export function createFormData(data) {
  return {
    type: CREATE_FORM_DATA,
    payload: data
  };
}

export function formDataCreated(data, hasError) {
  return {
    type: FORM_DATA_CREATED,
    payload: data,
    error: hasError
  };
}

export function editFormData(data) {
  return {
    type: EDIT_FORM_DATA,
    payload: data
  };
}

export function formDataEdited(data, hasError) {
  return {
    type: FORM_DATA_EDITED,
    payload: data,
    error: hasError
  };
}
