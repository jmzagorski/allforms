import { put, call, takeLatest } from 'redux-saga/effects';
import {
  receivedAllElements, 
  receivedElement,
  elementAdded,
  elementEdited,
  deletedElement
} from '../../../src/domain/index'
import * as saga from '../../../src/sagas/element';

describe('the element saga', () => {

  it('watches the other functions', () => {
    const api = {};

    const iterator = saga.default(api);

    expect(iterator.next().value).toEqual(
      takeLatest('REQUEST_ELEMENT', saga.getElement, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('CREATE_ELEMENT', saga.addElement, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('EDIT_ELEMENT', saga.editElement, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('DELETE_ELEMENT', saga.deleteElement, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('EDIT_FORM_TEMPLATE', saga.editTemplate, api)
    );
    expect(iterator.next()).toEqual({
      done: true, value: undefined
    });
  });

  [ { element: undefined, error: true },
    { element: null, error: true },
    { element: {}, error: false} 
  ].forEach(data => {
    it('gets the element', () => {
      const api = { get: () => { } };
      const action= { payload: { id: 1 } };

      const iterator = saga.getElement(api, action);

      expect(iterator.next().value).toEqual(
        call([api, api.get], action.payload.id)
      );
      expect(iterator.next(data.element).value).toEqual(
        put(receivedElement(data.element, data.error))
      );
      expect(iterator.next()).toEqual({
        done: true,
        value: undefined
      });
    });
  });

  [ null, undefined, '', 0 ].forEach(id => {
    it('has no iterator when payload id is missing', () => {
      const action= { payload: { id } };

      const iterator = saga.getElement(null, action);

      expect(iterator.next()).toEqual({
        done: true,
        value: undefined
      });
    });
  });

  it('sends an error in the catch of getting the element', () => {
    const api = { get: () => { } };
    const action= { payload: { id: 1 } };
    const err = new Error();

    const iterator = saga.getElement(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(receivedElement(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('adds the element', () => {
    const api = { save: () => { } };
    const action= { payload: {} };
    const element = {};

    const iterator = saga.addElement(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.save], action.payload)
    );
    expect(iterator.next(element).value).toEqual(
      put(elementAdded(element))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of add element', () => {
    const api = { save: () => { } };
    const action= { payload: 1 };
    const err = new Error();

    const iterator = saga.addElement(api, action);
    iterator.next()

    expect(iterator.throw(err).value).toEqual(
      put(elementAdded(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('edits the element', () => {
    const api = { save: () => { } };
    const action= { payload: {} };
    const element = {};

    const iterator = saga.editElement(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.save], action.payload)
    );
    expect(iterator.next(element).value).toEqual(
      put(elementEdited(element))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of edit element', () => {
    const api = { save: () => { } };
    const action= { payload: 1 };
    const err = new Error();

    const iterator = saga.editElement(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(elementEdited(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('edits the element template', () => {
    const api = { saveTemplate: () => { } };
    const action= { payload: { element: { id: 1 } } };
    const element = { id: 2 };

    const iterator = saga.editTemplate(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.saveTemplate], action.payload.element)
    );
    expect(iterator.next(element).value).toEqual(
      put(elementEdited(element))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  [ null, undefined ].forEach(element => {
    it('has no iterator when element is missing from payload', () => {
      const action= { payload: { element } };

      const iterator = saga.editTemplate(null, action);

      expect(iterator.next()).toEqual({
        done: true,
        value: undefined
      });
    });
  });

  it('sends an error in the catch of edit element template', () => {
    const api = { saveTemplate: () => { } };
    const action= { payload: { element: {} } };
    const err = new Error();

    const iterator = saga.editTemplate(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(elementEdited(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('deletes the element', () => {
    const api = { delete: () => { } };
    const action= { payload: { id: 1 } };
    const element = { id: 1 };

    const iterator = saga.deleteElement(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.delete], action.payload.id)
    );
    expect(iterator.next(element).value).toEqual(
      put(deletedElement(element))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of delete element', () => {
    const api = { delete: () => { } };
    const action= { payload: { id: 1 } };
    const err = new Error();

    const iterator = saga.deleteElement(api, action);
    iterator.next()

    expect(iterator.throw(err).value).toEqual(
      put(deletedElement(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });
});
