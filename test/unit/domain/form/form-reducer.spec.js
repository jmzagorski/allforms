import { forms } from '../../../../src/domain/index';
import using from 'jasmine-data-provider';

describe('the form reducer', () => {
  var sut;

  using([
    { state: null, list: [], returnState: { list: [] } },
    { state: { b: 'a' }, list: [], returnState: { b: 'a', list: [] } }
  ], data => {
    it('returns the form object on load success', () => {
      const action = {
        type: 'LOAD_FORMS_SUCCESS',
        forms: data.list
      };

      const state = forms(data.state, action);

      expect(state).toEqual(data.returnState);
    });
  });

  using([
    { state: null, active: 'c', returnState: { active: 'c' } },
    { state: { b: 'a' }, active: 'c', returnState: { b: 'a', active: 'c' } }
  ], data => {
    it('returns the state with the active form', () => {
      const action = {
        type: 'ACTIVATE_FORM_SUCCESS',
        id: data.active
      };

      const state = forms(data.state, action);

      expect(state).toEqual(data.returnState);
    });
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = forms(state, action);

    expect(newState).toBe(state);
  });
});

