import * as actions from './actions';

/**
 * @summary Listens and responds to element actions by creating or returning
 * the state
 */
export default function metadataReducer(state = {}, action) {
  switch (action.type) {
    case actions.RECEIVED_METADATA:
      if (action.error) return state;

      return Object.assign(state, {
        api: action.payload,
        status: checkIfSynced(state.elements, action.payload)
      });

    case actions.RECEIVED_ALL_ELEMENTS:
      if (action.error) return state;

      return Object.assign(state, {
        elements: action.payload,
        status: checkIfSynced(action.payload, state.api)
      });

    default:
      return state;
  }
}

function checkIfSynced(elements, metadata) {
  // if there is no metadata, then there is no external api. all elements will
  // map
  if (!metadata || !metadata.length) return 'success';

  // if there are elements without a metadata map, then that is bad because they
  // are entering data not at the external api
  if (elements) {
    for (let e of elements) {
      if (!metadata.find(m => e.name === m.name)) return 'danger';
    }
  }

  // if there is a metadata property but no element show a warning since no
  // everything is mapped
  for (let m of metadata) {
    if (!elements.find(e => e.name === m.name)) return 'warning';
  }

  return 'success';
}
