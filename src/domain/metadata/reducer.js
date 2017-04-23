import * as actions from './actions';
import { RECEIVED_FORM } from '../../domain';

const WARNING = 'warning';
const DANGER = 'danger';
const SUCCESS = 'success';

/**
 * @summary Listens and responds to element actions by creating or returning
 * the state
 */
export default function metadataReducer(state = { status: '', elements: [], api: [], statuses: [] },
  action) {
  switch (action.type) {
    case actions.RECEIVED_METADATA:
      if (action.error) return state;

      const mState = Object.assign({}, state, { api: action.payload });
      mState.statuses = calcAllStatuses(mState);
      mState.status = calcOverallStatus(mState.statuses);
      
      return mState;
    case RECEIVED_FORM:
      if (action.error) return state;

      const eState = Object.assign({}, state, { elements: action.payload.elements });
      eState.statuses = calcAllStatuses(eState);
      eState.status = calcOverallStatus(eState.statuses);
      
      return eState;

    default:
      return state;
  }
}

function calcElemStatuses(state) {
  let statuses = [ ];

  for (let e of state.elements) {
    const metadata = state.api.find(a => a.name === e.name);

    if (!metadata) {
      statuses.push({ element: e.name, metadata: '', status: DANGER });
    } else {
      statuses.push({ element: e.name, metadata: metadata.name, status: SUCCESS });
    }
  }

  return statuses;
}

function calcAllStatuses(state) {
  let statuses = [ ];

  for (let a of state.api) {
    const elem = state.elements.find(e => a.name === e.name);

    if (!elem) {
      statuses.push({ element: '', metadata: a.name, status: WARNING });
    } else {
      statuses.push({ element: elem.name, metadata: a.name, status: SUCCESS });
    }
  }

  for (let e of state.elements) {
    const metadata = state.api.find(a => a.name === e.name);

    if (!metadata) {
      statuses.push({ element: e.name, metadata: '', status: DANGER });
    }
  }

  return statuses;
}

function calcOverallStatus(statuses) {
  const statusNames = statuses.map(s => s.status);

  return statusNames.find(s => s === DANGER) ||
    statusNames.find(s => s === WARNING) ||
    SUCCESS;
}
