import * as selectors from '../../../../src/domain/form/form-selectors';

describe('the form selectors', () => {
  let state;
  let forms;

  beforeEach(() => {
    forms = [{
      id: 'a',
      name: 'aa',
      files: [
        { name: 'c', priority: 7, lastComment: 'zas', lastEditInDays: 4, icon: 'p' },
        { name: 'd', priority: 4, lastComment: 'zax', lastEditInDays: 5, icon: 't' }
      ]
    }, {
      id: 'b',
      name: 'bb',
      files: [
        { name: 'e', priority: 2, lastComment: 'ax', lastEditInDays: 6, icon: 'b' },
        { name: 'f', priority: 1, lastComment: 'ayy', lastEditInDays: 7, icon: 'q' }
      ]
    }
    ];
    state = {
      forms: {
        list: forms,
        active: 'a'
      }
    }
  })

  it('returns the active form', () => {
    const active = selectors.getActiveForm(state);

    expect(active.id).toEqual('a');
  });

  it('returns the active form with files sorted', () => {
    const active = selectors.getActiveForm(state);

    expect(active.files[0].priority).toEqual(4);
    expect(active.files[1].priority).toEqual(7);
  });

  it('returns the form list', () => {
    const actualForms = selectors.getFormList(state);

    expect(actualForms).toBe(forms)
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
});
