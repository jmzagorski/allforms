import { elementTypes } from '../../../../src/domain/index';

describe('the element types reducer', () => {

  [ { error: true, expected: [] },
    { error: false, expected: [1] }
  ].forEach(data => {
    it('returns the action elements types when received', () => {
      const action = {
        type: 'RECEIVED_ELEMENT_TYPES',
        payload: [1],
        error: data.error
      };

      const state = elementTypes(null, action);

      expect(state).toEqual(data.expected);
    });
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = elementTypes(state, action);

    expect(newState).toBe(state);
  });
});
