import { formData } from '../../../../src/domain/index';

describe('the form data reducer', () => {

  it('received all the data forms', () => {
    const payload = [];
    const state ={};
    const action = {
      type: 'RECEIVED_DATA_FORMS',
      payload
    };

    const newState = formData(state, action);

    expect(newState.list).toBe(payload);
  });

  [ 'RECEIVED_FORM_DATA', 'FORM_DATA_CREATED', 'FORM_DATA_EDITED' ].forEach(type => {
    it('returns the payload on the current property', () => {
      const payload = {};
      const state ={};
      const action = {
        type,
        payload
      };

      const newState = formData(state, action);

      expect(newState.current).toBe(payload);
    });
  });

  [ 'RECEIVED_DATA_FORMS', 'RECEIVED_FORM_DATA', 'FORM_DATA_CREATED',
    'FORM_DATA_EDITED'
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

  it('returns the original state when no action type matched', () => {
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
