export const REQUEST_ELEMENT = 'REQUEST_ELEMENT';
export const CREATING_ELEMENT = 'CREATING_ELEMENT';
export const CREATE_ELEMENT = 'CREATE_ELEMENT';
export const EDIT_ELEMENT = 'EDIT_ELEMENT';
export const RECEIVED_ELEMENT = 'RECEIVED_ELEMENT';
export const ELEMENT_ADDED = 'ELEMENT_ADDED';
export const ELEMENT_EDITED = 'ELEMENT_EDITED';
export const DEFAULT_NEW_ELEMENT = 'DEFAULT_NEW_ELEMENT';

export function defaultNewElement(element) {
  return {
    type: DEFAULT_NEW_ELEMENT,
    payload: element
  }
};

/**
 * @summary creates the action when a new element has been initialized to create
 * @return {IAction} the action object
 */
export function creatingElement(element){
  return {
    type: CREATING_ELEMENT,
    payload: element
  };
}

/**
 * @summary creates the action for requesting a single element
 * @return {IAction} the action object
 */
export function requestElement(id) {
  return {
    type: REQUEST_ELEMENT,
    payload: {
      id
    }
  };
}

/**
 * @summary creates the action for receiving an element from the api
 * @param {IElement | Error} data the IElement object or error
 * @param {hasError} boolean determines if the data is an error
 * @return {IAction} the action object
 */
export function receivedElement(data, hasError) {
  return {
    type: RECEIVED_ELEMENT,
    payload: data,
    error: hasError
  };
}

/**
 * @summary creates the action for requesting to create an element
 * @return {IAction} the action object
 */
export function createElement(element) {
  return {
    type: CREATE_ELEMENT,
    payload: element
  };
}

/**
 * @summary creates the action for requesting to edit an element
 * @return {IAction} the action object
 */
export function editElement(element) {
  return {
    type: EDIT_ELEMENT,
    payload: element
  };
}

/**
 * @summary creates the action for adding a new element
 * @param {IElement | Error} data the new IElement object or error
 * @param {hasError} boolean determines if the data is an error
 * @return {IAction} the action object
 */
export function elementAdded(data, hasError) {
  return {
    type: ELEMENT_ADDED,
    payload: data,
    error: hasError
  };
}

/**
 * @summary creates the action for editin an existing element
 * @param {IElement | Error} data the edited IElement object or error
 * @param {hasError} boolean determines if the data is an error
 * @return {IAction} the action object
 */
export function elementEdited(data, hasError) {
  return {
    type: ELEMENT_EDITED,
    payload: data,
    error: hasError
  };
}
