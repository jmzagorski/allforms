import * as domain from '../../../../src/domain/index';

describe('the element type actions', () => {
  [ true, false ].forEach(hasError => {
    it('creates the action for receieved element types', () => {
      const data = {};
      const expected = {
        type: 'RECEIVED_ELEMENT_TYPES',
        payload: data,
        error: hasError
      };

      const actual = domain.receivedElementTypes(data, hasError);

      expect(actual).toEqual(expected);
    });
  });

  it('creates the action for requesting element types', () => {
    const expected = {
      type: 'REQUEST_ELEMENT_TYPES',
    };

    const actual = domain.requestElementTypes();

    expect(actual).toEqual(expected);
  });
});
