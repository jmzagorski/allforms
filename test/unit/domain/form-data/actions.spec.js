import * as domain from '../../../../src/domain/index';

describe('the form data actions', () => {

  it('creates the action for editing the data property on the form-data object', () => {
    const data = {};
    const expected = {
      type: 'EDIT_DATA_ON_FORM',
      payload: { api: 'a', formDataId: 1, formData: data }
    };

    const actual = domain.editDataOnForm('a', 1, data);

    expect(actual).toEqual(expected);
    expect(actual.payload.formData).toBe(data);
  });

  [ true, false ].forEach(hasError => {
    it('creates the action when external data is posted', () => {
      const data = {};
      const expected = {
        type: 'POSTED_EXTERNAL_DATA_FORM',
        payload: { formDataId: 1, something: 2 },
        error: hasError
      };

      const actual = domain.postedExternalDataForm(1, { something: 2 }, hasError);

      expect(actual).toEqual(expected);
    });
  });


  [ true, false ].forEach(hasError => {
    it('creates the action for all data forms received', () => {
      const data = {};
      const expected = {
        type: 'RECEIVED_DATA_FORMS',
        payload: data,
        error: hasError
      };

      const actual = domain.receivedDataForms(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });

  it('creates the action for a request for form data', () => {
    const expected = {
      type: 'REQUEST_FORM_DATA',
      payload: { name: 'a' }
    };

    const actual = domain.requestFormData('a');

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
