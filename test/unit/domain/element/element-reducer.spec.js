import { elements } from '../../../../src/domain/index';

describe('the element reducer', () => {
  var sut;

  it('returns the action elements on load success', () => {
    const elems = [];
    const action = {
      type: 'LOAD_ELEMENTS_SUCCESS',
      elements: elems
    };

    const state = elements(null, action);

    expect(state).toBe(elems);
  });

  it('creates a new array with the new element', () => {
    const element = { value: '' };
    const existing = { value: 'blah' };
    const state = [ existing ];
    const action = {
      type: 'ADD_ELEMENT_SUCCESS',
      element
    };

    const newState = elements(state, action);

    expect(newState).not.toBe(state);
    expect(newState).toContain(element);
    expect(newState).toContain(existing);
    expect(newState.map(s => s.value)).toContain('blah');
  });

  it('creates a new array with the edited element', () => {
    const existing = { id: 5 };
    const state = [ existing ];
    const action = {
      type: 'EDIT_ELEMENT_SUCCESS',
      element: existing
    };

    const newState = elements(state, action);

    expect(newState).not.toBe(state);
    expect(newState[0]).not.toBe(existing);
    expect(newState).toContain(existing);
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = elements(state, action);

    expect(newState).toBe(state);
  });
});
