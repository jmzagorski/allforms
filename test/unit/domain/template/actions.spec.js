import * as actions from '../../../../src/domain/index'

describe('the template actions', () => {

  it('creates the action to request a template', () => {
    const expected = {
      type: 'REQUEST_TEMPLATE',
      payload: { id: 1 }
    };

    const actual = actions.requestTemplate(1);

    expect(actual).toEqual(expected);
  });

  [ true, false ].forEach(error => {
    it('creates the action for a received template', () => {
      const payload = { id: 1 };
      const expected = {
        type: 'RECEIVED_TEMPLATE',
        payload,
        error
      };

      const actual = actions.receivedTemplate(payload, error);

      expect(actual).toEqual(expected);
    });
  });

  it('creates the action to to create a template', () => {
    const expected = {
      type: 'CREATE_TEMPLATE',
      payload: { id: 1 }
    };

    const actual = actions.createTemplate(expected.payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toEqual(expected.payload);
  });

  it('creates the action to to edit a template', () => {
    const expected = {
      type: 'EDIT_TEMPLATE',
      payload: { id: 1 }
    };

    const actual = actions.editTemplate(expected.payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toEqual(expected.payload);
  });

  [ true, false ].forEach(error => {
    it('creates the action for a created template', () => {
      const payload = { id: 1 };
      const expected = {
        type: 'TEMPLATE_CREATED',
        payload,
        error
      };

      const actual = actions.templateCreated(payload, error);

      expect(actual).toEqual(expected);
    });
  });

  [ true, false ].forEach(error => {
    it('creates the action for an edited template', () => {
      const payload = { id: 1 };
      const expected = {
        type: 'TEMPLATE_EDITED',
        payload,
        error
      };

      const actual = actions.templateEdited(payload, error);

      expect(actual).toEqual(expected);
    });
  });
});
