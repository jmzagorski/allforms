import * as domain from '../../../../src/domain/index';

describe('the element actions', () => {

  it('creates the action for setting up the defaults on a new element', () => {
    const payload = {};
    const expected = {
      type: 'DEFAULT_NEW_ELEMENT',
      payload
    };

    const actual = domain.defaultNewElement(payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toBe(payload);
  });

  it('creates the action for requesting an element', () => {
    const expected = {
      type: 'REQUEST_ELEMENT',
      payload: { id: 1 }
    };

    const actual = domain.requestElement(1);

    expect(actual).toEqual(expected);
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for received element', () => {
      const data = {};
      const expected = {
        type: 'RECEIVED_ELEMENT',
        payload: data,
        error: hasError
      };

      const actual = domain.receivedElement(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });

  it('creates the action for creating an element', () => {
    const data = {};
    const expected = {
      type: 'CREATE_ELEMENT',
      payload: data
    };

    const actual = domain.createElement(data);

    expect(actual).toEqual(expected);
    expect(actual.payload).toBe(data);
  });

  it('creates the action for editing an element', () => {
    const data = {};
    const expected = {
      type: 'EDIT_ELEMENT',
      payload: data
    };

    const actual = domain.editElement(data);

    expect(actual).toEqual(expected);
    expect(actual.payload).toBe(data);
  });

  it('creates the action for deleting an element', () => {
    const data = {};
    const expected = {
      type: 'DELETE_ELEMENT',
      payload: { id: 1 }
    };

    const actual = domain.deleteElement(1);

    expect(actual).toEqual(expected);
    expect(actual.payload).toEqual({ id: 1 });
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for an element being added', () => {
      const data = {};
      const expected = {
        type: 'ELEMENT_ADDED',
        payload: data,
        error: hasError
      };

      const actual = domain.elementAdded(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for an element being edited', () => {
      const data = {};
      const expected = {
        type: 'ELEMENT_EDITED',
        payload: data,
        error: hasError
      };

      const actual = domain.elementEdited(data, hasError);

      expect(actual).toEqual(expected);
      expect(actual.payload).toBe(data);
    });
  });

  [ true, false ].forEach(hasError => {
    it('creates the action for an element being deleted', () => {
      const data = {};
      const expected = {
        type: 'ELEMENT_DELETED',
        payload: data,
        error: hasError
      };

      const actual = domain.deletedElement(data, hasError);

      expect(actual).toEqual(expected);
    });
  });
});
