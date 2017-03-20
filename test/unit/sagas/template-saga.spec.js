import { put, call, takeLatest } from 'redux-saga/effects';
import { receivedTemplate, templateCreated, templateEdited } from '../../../src/domain/index'
import * as saga from '../../../src/sagas/template-saga';

describe('the template saga', () => {

  it('watches the other functions', () => {
    const api = {};

    const iterator = saga.default(api);

    expect(iterator.next().value).toEqual(
      takeLatest('REQUEST_TEMPLATE', saga.getTemplate, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('CREATE_TEMPLATE', saga.createTemplate, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('EDIT_TEMPLATE', saga.editTemplate, api)
    );
    expect(iterator.next()).toEqual({
      done: true, value: undefined
    });
  });

  it('gets the template', () => {
    const template= { id: 1 };
    const api = { get: () => { } };
    const action= { payload: { id: 1 } };

    const iterator = saga.getTemplate(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.get], action.payload.id)
    );
    expect(iterator.next(template).value).toEqual(
      put(receivedTemplate(template))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of getting the template', () => {
    const api = { get: () => { } };
    const action= { payload: 1 };
    const err = new Error();

    const iterator = saga.getTemplate(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(receivedTemplate(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('adds the template', () => {
    const template= { id: 2 };
    const api = { add: () => { } };
    const action= { payload: { id: 1 } };

    const iterator = saga.createTemplate(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.add], action.payload)
    );
    expect(iterator.next(template).value).toEqual(
      put(templateCreated(template))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of adding the template', () => {
    const api = { add: () => { } };
    const action = { payload: 1 };
    const err = new Error();

    const iterator = saga.createTemplate(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(templateCreated(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('edits the template', () => {
    const template= { id: 2 };
    const api = { edit: () => { } };
    const action= { payload: { id: 1 } };

    const iterator = saga.editTemplate(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.edit], action.payload)
    );
    expect(iterator.next(template).value).toEqual(
      put(templateEdited(template))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of editing the template', () => {
    const api = { edit: () => { } };
    const action = { payload: 1 };
    const err = new Error();

    const iterator = saga.editTemplate(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(templateEdited(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });
});
