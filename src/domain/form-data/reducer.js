import * as actions from './actions';

/**
 * @summary manages the state for IFormDataSummary and IFormData
 * @param {Object} state the current data for the master forms data
 * @param {IFormDataSummary[]} state.list the array of IFormDataSummary
 * @param {IFromData} state.wip the current form being worked on
 * @return {Object} the new state
 */
export default function formData(state = {}, action) {

  switch(action.type) {
    case actions.RECEIVED_FORM_DATA:
      if (action.error) {
        return Object.assign({}, state, { wip: null  });
      }
      // let it fall through since the logic is the same!

    case actions.FORM_DATA_CREATED:
    case actions.FORM_DATA_EDITED:

      if (action.error) return state;

      return Object.assign({}, state, { wip: action.payload  });

    default:
      return state;
  }
}
