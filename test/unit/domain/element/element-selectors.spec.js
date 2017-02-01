import '../../setup';
import * as selectors from '../../../../src/domain/element/element-selectors';

describe('the element selectors', () => {

  it('returns the elements from the state', () => {
    const expectElements = [];
    const state = { elements: expectElements };

    const actualElements = selectors.getElements(state);

    expect(actualElements).toBe(expectElements);
  });

});

