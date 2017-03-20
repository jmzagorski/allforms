import * as domain from '../../../../src/domain/index';

describe('the form data actions', () => {

  it('creates the action for requesting the form data list', () => {
    const expected = {
      type: 'REQUEST_FORM_DATA_LIST',
      payload: { formId: 1 }
    };

    const actual = domain.requestFormDataList(1);

    expect(actual).toEqual(expected);
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for received form data list', () => {
      const data = {};
      const expected = {
        type: 'RECEIVED_FORM_DATA_LIST',
        payload: data,
        error: hasError
      };

      const actual = domain.receivedFormDataList(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });

  it('creates the action for a request for form data', () => {
    const expected = {
      type: 'REQUEST_FORM_DATA',
      payload: { formDataId: 1 }
    };

    const actual = domain.requestFormData(1);

    expect(actual).toEqual(expected);
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for form data received', () => {
      const data = {};
      const expected = {
        type: 'RECEIVED_FORM_DATA',
        payload: data,
        error: hasError
      };

      const actual = domain.receivedFormData(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });

  it('creates the action for requesting to create a new form data', () => {
    const payload = {};
    const expected = {
      type: 'CREATE_FORM_DATA',
      payload
    };

    const actual = domain.createFormData(payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toBe(payload);
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for form data created', () => {
      const data = {};
      const expected = {
        type: 'FORM_DATA_CREATED',
        payload: data,
        error: hasError
      };

      const actual = domain.formDataCreated(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });

  it('creates the action for requesting to edit a new form data', () => {
    const payload = {};
    const expected = {
      type: 'EDIT_FORM_DATA',
      payload
    };

    const actual = domain.editFormData(payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toBe(payload);
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for form data edited', () => {
      const data = {};
      const expected = {
        type: 'FORM_DATA_EDITED',
        payload: data,
        error: hasError
      };

      const actual = domain.formDataEdited(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });
});
