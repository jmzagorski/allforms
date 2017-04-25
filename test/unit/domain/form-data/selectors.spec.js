import * as selectors from '../../../../src/domain/form-data/selectors';

describe('the form data selectors', () => {
  let state;
  let form;

  it('returns the form data from the state', () => {
    const expected = {};
    const state = { formData: { current: expected } };

    const actual = selectors.getFormData(state);

    expect(actual).toBe(expected);
  });

  [ null, undefined ].forEach(current => {
    it('returns null if no form data on state', () => {
      const expected = {};
      const state = { formData: current };

      const actual = selectors.getFormData(state);

      expect(actual).toEqual(null);
    });
  });

  it('returns the form data list from the state', () => {
    const expected = [];
    const state = { formData: { list: expected } };

    const actual = selectors.getDataFormList(state);

    expect(actual).toBe(expected);
  });

  [ null, undefined ].forEach(list => {
    it('returns the empty array if no form data list from the state', () => {
      const expected = {};
      const state = { formData: list };

      const actual = selectors.getDataFormList(state);

      expect(actual).toEqual([]);
    });
  });
});
