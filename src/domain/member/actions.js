export const REQUEST_CURRENT_MEMBER = 'REQUEST_CURRENT_MEMBER';
export const RECEIVED_CURRENT_MEMBER = 'RECEIVED_CURRENT_MEMBER';

/**
 * @summary action creator for requesting the logined in member
 * @return {IAction} the action object
 */
export function requestCurrentMember() {
  return {
    type: REQUEST_CURRENT_MEMBER,
    payload: null 
  }
}

/**
 * @summary action creator for when the currently loggged in member is received
 * @param {IMember | Error} data the IForm object or Error object
 * @param {Boolean} [hasError] a flag to indicate in the data arg is an error
 * @return {IAction} the action object
 */
export function receivedCurrentMember(data, hasError) {
  return {
    type: RECEIVED_CURRENT_MEMBER,
    payload: data,
    error: hasError
  };
}
