import '../../setup';
import * as selectors from '../../../../src/domain/form/form-selectors';

describe('the form selectors', () => {
  let state;
  let forms;

  beforeEach(() => {
    forms = [
      { name: 'a', files: [ { priority: 7 }, { priority: 4 } ]},
      { name: 'b', files: [ { priority: 2 }, { priority: 1 } ]}
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

    expect(active.name).toEqual('a');
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
});
