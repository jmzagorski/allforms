import { template } from '../../../../src/domain/index';

describe('the template reducer', () => {

  it('returns the state when there is an errro on received', () => {
    const state = {};
    const action = { error: true, type: 'RECEIVED_TEMPLATE' }

    const newState = template(state, {});

    expect(newState).toBe(state);
  });

  [ 'RECEIVED_TEMPLATE', 'TEMPLATE_CREATED', 'TEMPLATE_EDITED' ].forEach(type => {
    it('returns the template for actions', () => {
      const payload = {};
      const action = {
        type,
        payload
      }

      const newState = template(null, action);

      expect(newState).toBe(payload);
    });
  });

  it('returns the original state when no action type matches', () => {
    const state = [];
    const action = { type: '' };

    const newState = template(state, action);

    expect(newState).toBe(state);
  });
});
