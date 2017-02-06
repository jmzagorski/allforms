import '../../setup';
import { elementTypes } from '../../../../src/domain/index';

describe('the element types reducer', () => {
  var sut;

  it('returns the action elements on load success', () => {
    const types = [];
    const action = {
      type: 'LOAD_ELEMENT_TYPES_SUCCESS',
      elementTypes: types
    };

    const state = elementTypes(null, action);

    expect(state).toBe(types);
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = elementTypes(state, action);

    expect(newState).toBe(state);
  });
});
