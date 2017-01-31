import { forms } from '../../../../src/domain/index';

describe('the form reducer', () => {
  var sut;

  it('returns the action forms on load success', () => {
    const pForms = [];
    const action = {
      type: 'LOAD_FORMS_SUCCESS',
      forms: pForms
    };

    const state = forms(null, action);

    expect(state).toBe(pForms);
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = forms(state, action);

    expect(newState).toBe(state);
  });
});

