import * as domain from '../../../../src/domain/index';

describe('the metadata actions', () => {

  it('creates the action for requesting metadata', () => {
    const formName = 'b';
    const memberId = 'a'
    const expected = {
      type: 'REQUEST_METADATA',
      payload: { formName, memberId }
    };

    const actual = domain.requestMetadata(memberId, formName);

    expect(actual).toEqual(expected);
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for the metadata being received', () => {
      const data = {};
      const expected = {
        type: 'RECEIVED_METADATA',
        payload: data,
        error: hasError
      };

      const actual = domain.receivedMetadata(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for all the elements being received', () => {
      const data = {};
      const expected = {
        type: 'RECEIVED_ALL_ELEMENTS',
        payload: data,
        error: hasError
      };

      const actual = domain.receivedAllElements(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });
});
