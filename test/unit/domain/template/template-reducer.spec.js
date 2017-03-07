import { template } from '../../../../src/domain/index';
import using from 'jasmine-data-provider';

describe('the template reducer', () => {
  var sut;

  using([ 'LOAD_TEMPLATE_SUCCESS', 'ADD_TEMPLATE_SUCCESS' ], type => {
    it('returns the action template on load success', () => {
      const pTemplate = {};
      const action = {
        type,
        template: pTemplate
      };

      const state = template(null, action);

      expect(state).toBe(pTemplate);
    });
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = template(state, action);

    expect(newState).toBe(state);
  });
});
