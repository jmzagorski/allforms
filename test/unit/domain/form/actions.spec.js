import * as domain from '../../../../src/domain/index';
import { setupSpy } from '../../jasmine-helpers';

describe('the form actions', () => {
  let sut;
  let storeSpy;
  let apiSpy;

  [ true, false ].forEach(error => {
    it('create an action for all forms received', () => {
      const payload = {};
      const expected = {
        type: 'RECEIVED_FORMS',
        payload,
        error
      };

      const actual = domain.receivedForms(payload, error);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(payload);
    });
  });

  it('create an action to request a members form', () => {
    const formName = 'a';
    const memberId = 'b';
    const expected = {
      type: 'REQUEST_MEMBER_FORM',
      payload: { memberId, formName }
    };

    const actual = domain.requestMemberForm(memberId, formName);

    expect(actual).toEqual(expected);
  });

  it('create an action to request a form', () => {
    const id = 1;
    const expected = {
      type: 'REQUEST_FORM',
      payload: { id }
    };

    const actual = domain.requestForm(id);

    expect(actual).toEqual(expected);
  });

  [ true, false ].forEach(error => {
    it('create an action for a received form', () => {
      const payload = {};
      const expected = {
        type: 'RECEIVED_FORM',
        payload,
        error
      };

      const actual = domain.receivedForm(payload, error);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(payload);
    });
  });

  it('create an action for a form being created', () => {
    const payload = {};
    const expected = {
      type: 'CREATE_FORM',
      payload
    };

    const actual = domain.createForm(payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toBe(payload);
  });

  [ true, false ].forEach(error => {
    it('create an action for an added form', () => {
      const payload = {};
      const expected = {
        type: 'FORM_CREATED',
        payload,
        error
      };

      const actual = domain.formAdded(payload, error);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(payload);
    });
  });

  it('create an action for editing the form template', () => {
    const payload = {};
    const expected = {
      type: 'EDIT_FORM_TEMPLATE',
      payload
    };

    const actual = domain.editFormTemplate(payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toBe(payload);
  });

  it('create an action for a form being edited', () => {
    const payload = {};
    const expected = {
      type: 'EDIT_FORM',
      payload
    };

    const actual = domain.editForm(payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toBe(payload);
  });

  [ true, false ].forEach(error => {
    it('create an action for an edited form', () => {
      const payload = {};
      const expected = {
        type: 'FORM_EDITED',
        payload,
        error
      };

      const actual = domain.formEdited(payload, error);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(payload);
    });
  });
});
