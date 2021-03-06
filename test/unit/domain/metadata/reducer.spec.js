import * as domain from '../../../../src/domain';

describe('the metadata reducer', () => {

  it('returns the default state if no action', () => {
    const state = domain.metadata(undefined, {});

    expect(state).toEqual({ status: '', elements: [], api: [], statuses: []});
  });

  [ domain.RECEIVED_METADATA, domain.RECEIVED_FORM ].forEach(type => {
    it('returns the original state on error for actions', () => {
      const state = {};
      const action = { type, error: true }

      const newState = domain.metadata(state, action);

      expect(newState).toBe(state);
    });
  });

  it('sets the status to danger if an element does not exist in the metadata', () => {
    const state = { api: [ { name: 'a' } ] };
    const action = {
      type: domain.RECEIVED_FORM,
      payload: { elements: [ { name: 'b' } ] }
    }

    const newState = domain.metadata(state, action);

    expect(newState.status).toEqual('danger');
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

  it('sets the status to success if all elements and metadata match on received metadata', () => {
    const state = { elements: [ { name: 'a' }, { name: 'b' } ] };
    const action = {
      type: domain.RECEIVED_METADATA,
      payload: [ { name: 'a' }, { name: 'b' } ]
    }

    const newState = domain.metadata(state, action);

    expect(newState.status).toEqual('success');
  });

  it('sets the status to success if all elements and metadata match on received elements', () => {
    const state = { api: [ { name: 'a' }, { name: 'b' } ] };
    const action = {
      type: domain.RECEIVED_FORM,
      payload: { elements: [ { name: 'a' }, { name: 'b' } ] }
    }

    const newState = domain.metadata(state, action);

    expect(newState.status).toEqual('success');
  });

  it('adds the elements to the state', () => {
    const state = { elements: [ { name: 'a' }, { name: 'b' } ], api: [] };
    const action = {
      type: domain.RECEIVED_FORM,
      payload: { elements: [ { name: 'a' }, { name: 'b' } ] }
    }

    const newState = domain.metadata(state, action);

    expect(newState).not.toBe(state);
    expect(newState.elements).not.toBe(state.elements);
    expect(newState.elements).toEqual(action.payload.elements);
  });

  [ null, undefined ].forEach(elements => {
    it('does not add the elements when does not exist on payload', () => {
      const state = { elements: [ { name: 'a' }, { name: 'b' } ], api: [] };
      const action = {
        type: domain.RECEIVED_FORM,
        payload: { elements }
      }

      const newState = domain.metadata(state, action);

      expect(newState).toBe(state);
    });
  });

  it('adds the api metadatum to the state', () => {
    const state = { api: [ { name: 'a' }, { name: 'b' } ], elements: [] };
    const action = {
      type: domain.RECEIVED_METADATA,
      payload: [ { name: 'a' }, { name: 'b' } ]
    }

    const newState = domain.metadata(state, action);

    expect(newState).not.toBe(state);
    expect(newState.api).not.toBe(state.api);
    expect(newState.api).toEqual(action.payload);
  });


  it('maps the metadata and elements on received metadata', () => {
    const state = { elements: [ { name: 'a' }, { name: 'b' } ] };
    const action = {
      type: domain.RECEIVED_METADATA,
      payload: [ { name: 'a' }, { name: 'c' } ]
    };

    const newState = domain.metadata(state, action);

    expect(newState.statuses).toEqual([
    { element: 'a', metadata: 'a', status: 'success' },
      { element: '', metadata: 'c', status: 'warning' },
      { element: 'b', metadata: '', status: 'danger' }
  ]);
  });

  it('returns the state if no action type matches', () => {
    const state = {};

    const newState = domain.metadata(state, {});

    expect(newState).toBe(state);
  });
});
