import * as domain from '../../../../src/domain/index';

describe('the form reducer', () => {

  it('returns null when sending a request for the form', () => {
    const action = {
      type: 'REQUEST_FORM'
    };

    const state = domain.form(null, action);

    expect(state).toEqual(null);
  });

  [
    domain.RECEIVED_FORM, domain.FORM_CREATED, domain.FORM_EDITED
  ].forEach(type => {
    it('returns the original state on error for actions', () => {
      const state = {};
      const action = { type, error: true };

      const newState = domain.form(state, action);

      expect(newState).toBe(state);
    });
  });

  [
    domain.RECEIVED_FORM, domain.FORM_CREATED, domain.FORM_EDITED, domain.EDIT_FORM,
    domain.CREATE_FORM
  ].forEach(type => {
    it('returns the payload for actions', () => {
      const payload = {};
      const action = { type, payload };

      const newState = domain.form(null, action);

      expect(newState).toBe(payload);
    });
  });

  it('returns adds the template on edit form tempalte', () => {
    const state = {};
    const action = {
      type: 'EDIT_FORM_TEMPLATE',
      payload: 'a'
    };

    const newState = domain.form(state, action);

    expect(newState).not.toBe(state);
    expect(newState.template).toEqual('a');
  });

  it('returns the original state when no action type matches', () => {
    const state = {};
    const action = { type: '' };

    const newState = domain.form(state, action);

    expect(newState).toBe(state);
  });
});
