import '../../setup';
import * as selectors from '../../../../src/domain/element-type/element-type-selectors';

describe('the element type selectors', () => {

  it('returns the element types from the state', () => {
    const expectTypes = [];
    const state = { elementTypes: expectTypes };

    const actualTypes = selectors.getElementTypes(state);

    expect(actualTypes).toBe(expectTypes);
  });

});
