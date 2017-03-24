import * as selectors from '../../../../src/domain/element/selectors';

describe('the element selectors', () => {

  it('returns the active element from the state', () => {
    const expected = { id: 1 };
    const state = { element: expected };

    const actual = selectors.getActiveElement(state);

    expect(actual).toBe(expected);
  });
});
