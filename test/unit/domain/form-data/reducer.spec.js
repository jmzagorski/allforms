import { formData } from '../../../../src/domain/index';

describe('the form data reducer', () => {

  [ 'RECEIVED_FORM_DATA', 'FORM_DATA_CREATED', 'FORM_DATA_EDITED'
  ].forEach(type => {
    it('returns the payload', () => {
      const payload = {};
      const state ={};
      const action = {
        type,
        payload
      };

      const newState = formData(state, action);

      expect(newState).toBe(payload);
    });
  });

  [ 'RECEIVED_FORM_DATA', 'FORM_DATA_CREATED', 'FORM_DATA_EDITED'
  ].forEach(type => {
    it('returns the original state on error', () => {
      const state ={};
      const action = {
        type,
        error: true
      };

      const newState = formData(state, action);

      expect(newState).toBe(state);
    });
  });

  it('returns the by default', () => {
    const state ={};
    const action = { type: 'Anyting' };

    const newState = formData(state, action);

    expect(newState).toBe(state);
  });

  it('defaults the state to null', () => {
    const action = { type: '' };

    const newState = formData(undefined, action);

    expect(newState).toEqual(null);
  });
});
