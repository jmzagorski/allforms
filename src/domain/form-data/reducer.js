import * as actions from './actions';

/**
 * @summary manages the state for IFormDataSummary and IFormData
 * @param {Object} state the current data for the master forms data
 * @param {IFormDataSummary[]} state.list the array of IFormDataSummary
 * @param {IFromData} state.wip the current form being worked on
 * @return {Object} the new state
 */
export default function formData(state = null, action) {

  switch(action.type) {
    case actions.RECEIVED_FORM_DATA:
    case actions.FORM_DATA_CREATED:
    case actions.FORM_DATA_EDITED:

      if (action.error) return state;

      return action.payload

    default:
      return state;
  }
}
