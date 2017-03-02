import { elements } from '../../../../src/domain/index';

describe('the element reducer', () => {
  var sut;

  it('returns the active element and list on element load success', () => {
    const elem = { id: 1 };
    const action = {
      type: 'LOAD_ELEMENT_SUCCESS',
      element: elem
    };

    const state = elements(null, action);

    expect(state.list).toContain(elem);
    expect(state.active).toEqual(1);
  });

  it('creates a new array with the new element', () => {
    const element = { id: 1 };
    const existing = { id: 2 };
    const state = { list: [ existing ] };
    const action = {
      type: 'ADD_ELEMENT_SUCCESS',
      element
    };

    const newState = elements(state, action);

    expect(newState).not.toBe(state);
    expect(newState.list).toContain(element);
    expect(newState.list).toContain(existing);
    expect(newState.active).toEqual(element.id)
  });

  it('creates a new array with the edited element', () => {
    const existing = { id: 5 };
    const state = { list: [ existing ] };
    const action = {
      type: 'EDIT_ELEMENT_SUCCESS',
      element: existing
    };

    const newState = elements(state, action);

    expect(newState).not.toBe(state);
    expect(newState.list[0]).not.toBe(existing);
    expect(newState.list).toContain(existing);
  });

  it('removes the active element when element not found', () => {
    const state = { active: 1 };
    const action = {
      type: 'ELEMENT_NOT_FOUND'
    };

    const newState = elements(state, action);

    expect(newState.active).toEqual(null);
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = elements(state, action);

    expect(newState).toBe(state);
  });
});
