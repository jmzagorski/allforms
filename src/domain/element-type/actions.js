export const REQUEST_ELEMENT_TYPES = 'REQUEST_ELEMENT_TYPES';
export const RECEIVED_ELEMENT_TYPES = 'RECEIVED_ELEMENT_TYPES';

/**
 * @summary creates the action for receiving an element type from the api
 * @param {IElementType | Error} data the IElementType object or error
 * @param {hasError} boolean determines if the data is an error
 * @return {IAction} the action object
 */
export function receivedElementTypes(data, hasError) {
  return {
    type: RECEIVED_ELEMENT_TYPES,
    payload: data,
    error: hasError,
    meta: {
      isSignal: true
    }
  };
}

/**
 * @summary creates the action for requesting all element types
 * @return {IAction} the action object
 */
export function requestElementTypes() {
  return {
    type: REQUEST_ELEMENT_TYPES
  };
}
