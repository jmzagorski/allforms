import * as selectors from '../../../../src/domain/form/selectors';

describe('the form selectors', () => {
  let state;
  let form;

  beforeEach(() => {
    form = {
      id: 'a',
      name: 'aa',
      files: [
        { name: 'c', priority: 7, lastComment: 'zas', lastEditInDays: 4, icon: 'p' },
        { name: 'd', priority: 4, lastComment: 'zax', lastEditInDays: 5, icon: 't' }
      ]
    };
    state = { form }
  })

  it('returns the active form', () => {
    const actual = selectors.getActiveForm(state);

    expect(actual).toBe(form);
  });

  it('returns null if no active form', () => {
    state.form = null;

    const actual = selectors.getActiveForm(state);

    expect(actual).toEqual(null);
  });

  it('returns the active form with files sorted', () => {
    const actual = selectors.getActiveForm(state);

    expect(actual.files[0].priority).toEqual(4);
    expect(actual.files[1].priority).toEqual(7);
  });

  it('returns the forms recent history', () => {
    const actualHistory = selectors.getRecentFormHistory(state);

    expect(actualHistory).toContain({
      name: 'c', formId: 'a', formName: 'aa', comment: 'zas', revisedDays: 4, icon: 'p'
    });
    expect(actualHistory).toContain({
      name: 'd', formId: 'a', formName: 'aa', comment: 'zax', revisedDays: 5, icon: 't'
    });
  });

  it('returns null history when no active form', () => {
    state.form = null;

    const actualHistory = selectors.getRecentFormHistory(state);

    expect(actualHistory).toEqual(null);
  });
});
