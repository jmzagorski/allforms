import * as selectors from '../../../../src/domain/form/selectors';

describe('the form selectors', () => {
  it('returns the active form', () => {
    const form = {};
    const state = { form }
    const actual = selectors.getActiveForm(state);

    expect(actual).toBe(form);
  });
});
