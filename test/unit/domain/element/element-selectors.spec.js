import * as selectors from '../../../../src/domain/element/selectors';

describe('the element selectors', () => {

  it('returns the elements from the state', () => {
    const expectElements = [];
    const state = { elements: { list: expectElements } };

    const actualElements = selectors.getElements(state);

    expect(actualElements).toBe(expectElements);
  });

  it('returns the active element from the state', () => {
    const expected = { id: 1 };
    const list = [ expected ];
    const state = { elements: { list, active: 1 } };

    const actual = selectors.getActiveElement(state);

    expect(actual).toBe(expected);
  });
});
