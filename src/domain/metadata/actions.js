export const REQUEST_METADATA = 'REQUEST_METADATA';
export const RECEIVED_METADATA = 'RECEIVED_METADATA';
export const RECEIVED_ALL_ELEMENTS = 'RECEIVED_ALL_ELEMENTS';

/**
 * @summary creates the action for requesting the metadata
 * @param {string} formId the id of the form
 * @return {IAction} the action object
 */
export function requestMetadata(formId) {
  return {
    type: REQUEST_METADATA,
    payload: { formId }
  };
}

/**
 * @summary creates the action for receiving the metadata
 * @param {IMetadata[] | Error} data the IMetadata data or error
 * @param {hasError} boolean determines if the data is an error
 * @return {IAction} the action object
 */
export function receivedMetadata(data, hasError) {
  return {
    type: RECEIVED_METADATA,
    payload: data,
    error: hasError
  };
}

/**
 * @summary creates the action for receiving all elements for on a form
 * @param {IElement[] | Error} data the IElement array or error
 * @param {hasError} boolean determines if the data is an error
 * @return {IAction} the action object
 */
export function receivedAllElements(data, hasError) {
  return {
    type: RECEIVED_ALL_ELEMENTS,
    payload: data,
    error: hasError
  };
}
