import { template } from '../../../../src/domain/index';

describe('the template reducer', () => {
  var sut;

  it('returns the action template on load success', () => {
    const pTemplate = {};
    const action = {
      type: 'LOAD_TEMPLATE_SUCCESS',
      template: pTemplate
    };

    const state = template(null, action);

    expect(state).toBe(pTemplate);
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = template(state, action);

    expect(newState).toBe(state);
  });
});
