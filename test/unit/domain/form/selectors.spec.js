import * as selectors from '../../../../src/domain/form/selectors';

describe('the form selectors', () => {

  it('returns the current form from the state', () => {
    const form = {};
    const state = { form: { current: form } }
    const actual = selectors.getActiveForm(state);

    expect(actual).toBe(form);
  });

  [ null, undefined ].forEach(current => {
    it('returns null if no form is on the state', () => {
      const expected = {};
      const state = { form: current };

      const actual = selectors.getActiveForm(state);

      expect(actual).toEqual(null);
    });
  });

  it('returns the form list on the state', () => {
    const list = [];
    const state = { form: { list } }
    const actual = selectors.getFormList(state);

    expect(actual).toBe(list);
  });

  [ null, undefined ].forEach(list => {
    it('returns empty array if no form list on the state', () => {
      const expected = {};
      const state = { form: list };

      const actual = selectors.getFormList(state);

      expect(actual).toEqual([]);
    });
  });
});
