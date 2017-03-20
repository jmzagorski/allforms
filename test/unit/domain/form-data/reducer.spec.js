import { formData } from '../../../../src/domain/index';

describe('the form data reducer', () => {

  it('returns the form data list when received', () => {
    const payload = [];
    const state ={};
    const action = {
      type: 'RECEIVED_FORM_DATA_LIST',
      payload
    };

    const newState = formData(state, action);

    expect(newState).not.toBe(state);
    expect(newState.list).toBe(payload);
  });

  [ 'RECEIVED_FORM_DATA', 'FORM_DATA_CREATED', 'FORM_DATA_EDITED'
  ].forEach(type => {
    it('returns the wip payload for new form data and editing', () => {
      const payload = {};
      const state ={};
      const action = {
        type,
        payload
      };

      const newState = formData(state, action);

      expect(newState).not.toBe(state);
      expect(newState.wip).toBe(payload);
    });
  });

  it('removes the wip object when received is an error', () => {
    const payload = { id: 1 };
    const state ={};
    const action = {
      type: 'RECEIVED_FORM_DATA',
      payload,
      error: true
    };

    const newState = formData(state, action);

    expect(newState).not.toBe(state);
    expect(newState.wip).toEqual(null);
  });

  [ 'FORM_DATA_CREATED', 'FORM_DATA_EDITED', 'DEFAULT'
  ].forEach(type => {
    it('returns the original state', () => {
      const payload = {};
      const state ={};
      const action = {
        type,
        payload,
        error: true
      };

      const newState = formData(state, action);

      expect(newState).toBe(state);
    });
  });
});
