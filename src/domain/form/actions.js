export const REQUEST_FORM = 'REQUEST_FORM';
export const REQUEST_MEMBER_FORM = 'REQUEST_MEMBER_FORM';
export const RECEIVED_FORM = 'RECEIVED_FORM';
export const CREATE_FORM = 'CREATE_FORM';
export const FORM_CREATED = 'FORM_CREATED';
export const EDIT_FORM = 'EDIT_FORM';
export const FORM_EDITED = 'FORM_EDITED';
export const EDIT_FORM_TEMPLATE = 'EDIT_FORM_TEMPLATE';

export function requestMemberForm(memberId, formName) {
  return {
    type: REQUEST_MEMBER_FORM,
    payload: { memberId, formName }
  };
}

/**
 * @summary action creator for when a request is submitted to get a form
 * @param {string} id the unique id of the IForm object
 * @return {IAction} the action object
 */
export function requestForm(id) {
  return {
    type: REQUEST_FORM,
    payload: { id }
  };
}

/**
 * @summary action creator for when the form is received from the server
 * @param {IForm | Error} data the IForm object or Error object
 * @param {Boolean} [hasError] a flag to indicate in the data arg is an error
 * @return {IAction} the action object
 */
export function receivedForm(data, hasError) {
  return {
    type: RECEIVED_FORM,
    payload: data,
    error: hasError
  };
}

/**
 * @summary action creator for creating a new IForm object
 * @param {IForm} form the new IForm object
 * @return {IAction} the action object
 */
export function createForm(form) {
  return {
    type: CREATE_FORM,
    payload: form
  };
}

/**
 * @summary action creator for when a form is done being created on the server
 * @param {IForm | Error} data the IForm object or Error object
 * @param {Boolean} [hasError] a flag to indicate in the data arg is an error
 * @return {IAction} the action object
 */
export function formAdded(data, hasError) {
  return {
    type: FORM_CREATED,
    payload: data,
    error: hasError
  };
}

/**
 * @summary action creator for editing a existing IForm object
 * @param {IForm} form the existing IForm object
 * @return {IAction} the action object
 */
export function editForm(form) {
  return {
    type: EDIT_FORM,
    payload: form
  };
}

/**
 * @summary action creator for editing the forms html template
 * @param {Object} template the object carrying the form and element templates
 * @param {Object} template.form the form template object
 * @param {Object} template.form.id the form id
 * @param {Object} template.form.template the form html
 * @param {Object} template.element.id the element id
 * @param {Object} template.element.template the element html
 * @return {IAction} the action object
 */
export function editFormTemplate(template) {
  return {
    type: EDIT_FORM_TEMPLATE,
    payload: template
  };
}

/**
 * @summary action creator for when a form is done editing on the server
 * @param {IForm | Error} data the IForm object or Error object
 * @param {Boolean} [hasError] a flag to indicate in the data arg is an error
 * @return {IAction} the action object
 */
export function formEdited(data, hasError) {
  return {
    type: FORM_EDITED,
    payload: data,
    error: hasError
  };
}
