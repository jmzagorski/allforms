import * as domain from '../../../../src/domain';

describe('the metadata reducer', () => {

  [ domain.RECEIVED_METADATA, domain.RECEIVED_ALL_ELEMENTS ].forEach(type => {
    it('returns the original state on error for actions', () => {
      const state = {};
      const action = { type, error: true }

      const newState = domain.metadata(state, action);

      expect(newState).toBe(state);
    });
  });

  it('returns the api on the state', () => {
    const payload = { }
    const action = {
      type: domain.RECEIVED_METADATA,
      payload
    }

    const newState = domain.metadata({}, action);

    expect(newState.api).toBe(payload);
  });

  [ null, undefined, [] ].forEach(metadata => {
    it('sets the status to success if no metadata', () => {
      const action = {
        type: domain.RECEIVED_METADATA,
        payload: metadata
      }

      const newState = domain.metadata({}, action);

      expect(newState.status).toEqual('success');
    });
  });

  it('sets the status to danger if an element does not exist in the metadata', () => {
    const state = { elements: [ { name: 'a' } ] };
    const action = {
      type: domain.RECEIVED_METADATA,
      payload: [ { name: 'b' } ]
    }

    const newState = domain.metadata(state, action);

    expect(newState.status).toEqual('danger');
  });

  it('returns the elements on the state', () => {
    const payload = { }
    const action = {
      type: domain.RECEIVED_ALL_ELEMENTS,
      payload
    }

    const newState = domain.metadata({}, action);

    expect(newState.elements).toBe(payload);
  });

  it('sets the status to warning if no element exists from the metadata', () => {
    const state = { elements: [ { name: 'a' } ] };
    const action = {
      type: domain.RECEIVED_METADATA,
      payload: [ { name: 'a' }, { name: 'b' } ]
    }

    const newState = domain.metadata(state, action);

    expect(newState.status).toEqual('warning');
  });

  it('sets the status to success if all elements and metadata match', () => {
    const state = { elements: [ { name: 'a' }, { name: 'b' } ] };
    const action = {
      type: domain.RECEIVED_METADATA,
      payload: [ { name: 'a' }, { name: 'b' } ]
    }

    const newState = domain.metadata(state, action);

    expect(newState.status).toEqual('success');
  });
});
