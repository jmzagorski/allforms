import * as domain from '../../../../src/domain';

describe('the member actions', () => {

  it('creates the action for requesting the current member', () => {
    const expected = {
      type: 'REQUEST_CURRENT_MEMBER',
      payload: null
    };

    const actual = domain.requestCurrentMember();

    expect(actual).toEqual(expected);
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for receiving the current member', () => {
      const data = {};
      const expected = {
        type: 'RECEIVED_CURRENT_MEMBER',
        payload: data,
        error: hasError
      };

      const actual = domain.receivedCurrentMember(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });
});
