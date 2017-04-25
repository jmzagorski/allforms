import * as domain from '../../../../src/domain/index';

describe('the form reducer', () => {

  it('returns the payload under the list property for all forms received', () => {
    const payload = [];
    const action = { type: domain.RECEIVED_FORMS, payload };

    const newState = domain.form(null, action);

    expect(newState.list).toBe(payload);
  });

  [ domain.RECEIVED_FORMS, domain.RECEIVED_FORM, domain.FORM_CREATED,
    domain.FORM_EDITED ].forEach(type => {
      it('returns the original state on error for actions', () => {
        const state = {};
        const action = { type, error: true };

        const newState = domain.form(state, action);

        expect(newState).toBe(state);
      });
    });

  [ domain.RECEIVED_FORM, domain.FORM_CREATED, domain.FORM_EDITED,
    domain.EDIT_FORM, domain.CREATE_FORM ].forEach(type => {
      it('returns the payload under the current property for actions', () => {
        const payload = {};
        const action = { type, payload };

        const newState = domain.form(null, action);

        expect(newState.current).toBe(payload);
      });
    });

  it('returns the original state when no action type matches', () => {
    const state = {};
    const action = { type: '' };

    const newState = domain.form(state, action);

    expect(newState).toBe(state);
  });
});
