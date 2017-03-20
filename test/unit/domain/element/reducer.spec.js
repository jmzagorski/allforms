import { elements } from '../../../../src/domain/index';

describe('the element reducer', () => {

  it('clears the active element when creating a new element', () => {
    const action = {
      type: 'CREATING_ELEMENT'
    };

    const state = elements(null, action);

    expect(state.active).toEqual(null);
  });

  it('returns the active element and list on received success', () => {
    const elem = { id: 1 };
    const action = {
      type: 'RECEIVED_ELEMENT',
      payload: elem
    };

    const state = elements(null, action);

    expect(state.list).toContain(elem);
    expect(state.active).toEqual(1);
  });

  it('does not duplicate an element retrieved twice', () => {
    const elem = { id: 1 };
    const state = { list: [ { id: 1 } ] }
    const action = {
      type: 'RECEIVED_ELEMENT',
      payload: elem
    };

    const newState = elements(state, action);

    expect(newState.list.length).toEqual(1);
    expect(newState.list).toContain(elem);
    expect(newState.active).toEqual(1);
  });

  it('removes the active element when error on received', () => {
    const action = {
      type: 'RECEIVED_ELEMENT',
      error: true
    };

    const newState = elements(null, action);

    expect(newState.active).toEqual(null);
  });

  it('creates a new array with the new element', () => {
    const element = { id: 1 };
    const existing = { id: 2 };
    const state = { list: [ existing ] };
    const action = {
      type: 'ELEMENT_ADDED',
      payload: element
    };

    const newState = elements(state, action);

    expect(newState).not.toBe(state);
    expect(newState.list).not.toBe(state.list);
    expect(newState.list).toContain(element);
    expect(newState.list).toContain(existing);
    expect(newState.active).toEqual(element.id)
  });

  it('returns the state with the element added has an errror', () => {
    const state = {}
    const action = {
      type: 'ELEMENT_ADDED',
      error: true
    };

    const newState = elements(state, action);

    expect(newState).toBe(state);
  });

  it('creates a new array with the edited element', () => {
    const existing = { id: 5 };
    const state = { list: [ existing ] };
    const action = {
      type: 'ELEMENT_EDITED',
      payload: existing
    };

    const newState = elements(state, action);

    expect(newState).not.toBe(state);
    expect(newState.list).not.toBe(state.list);
    expect(newState.list[0]).not.toBe(existing);
    expect(newState.list).toContain(existing);
  });

  it('returns the state with the element edited has an errror', () => {
    const state = {}
    const action = {
      type: 'ELEMENT_EDITED',
      error: true
    };

    const newState = elements(state, action);

    expect(newState).toBe(state);
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = elements(state, action);

    expect(newState).toBe(state);
  });
});
