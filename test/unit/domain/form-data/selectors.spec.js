import * as selectors from '../../../../src/domain/form-data/selectors';

describe('the form data selectors', () => {
  let state;
  let form;

  it('returns the form data', () => {
    const expected = {};
    const state = { formData: expected };

    const actual = selectors.getFormData(state);

    expect(actual).toBe(expected);
  });
});
