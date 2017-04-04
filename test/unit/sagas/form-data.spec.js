import { put, call, takeLatest } from 'redux-saga/effects';
import {
  receivedFormDataList,
  receivedFormData,
  formDataCreated,
  formDataEdited,
} from '../../../src/domain/index'
import * as saga from '../../../src/sagas/form-data';

describe('the form data saga', () => {

  it('watches the other functions', () => {
    const api = {};

    const iterator = saga.default(api);

    expect(iterator.next().value).toEqual(
      takeLatest('REQUEST_FORM_DATA', saga.getFormDataAsync, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('CREATE_FORM_DATA', saga.createFormDataAsync, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('EDIT_FORM_DATA', saga.editFormDataAsync, api)
    );
    expect(iterator.next()).toEqual({
      done: true, value: undefined
    });
  });

  it('gets the form data', () => {
    const returnedData = { id: 1 };
    const api = { get: () => { } };
    const action= { payload: { formDataId: 1 } };

    const iterator = saga.getFormDataAsync(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.get], action.payload.formDataId)
    );
    expect(iterator.next(returnedData).value).toEqual(
      put(receivedFormData(returnedData))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of getting the form data', () => {
    const api = { get: () => { } };
    const action= { payload: 1 };
    const err = new Error();

    const iterator = saga.getFormDataAsync(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(receivedFormData(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('creates the form data', () => {
    const returnedData = { id: 1 };
    const api = { save: () => { } };
    const action= { payload: { id: 2 } };

    const iterator = saga.createFormDataAsync(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.save], action.payload)
    );
    expect(iterator.next(returnedData).value).toEqual(
      put(formDataCreated(returnedData))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of creating the form data', () => {
    const api = { save: () => { } };
    const action= { payload: {} };
    const err = new Error();

    const iterator = saga.createFormDataAsync(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(formDataCreated(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('edits the form data', () => {
    const returnedData = { id: 1 };
    const api = { save: () => { } };
    const action= { payload: { id: 2 } };

    const iterator = saga.editFormDataAsync(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.save], action.payload)
    );
    expect(iterator.next(returnedData).value).toEqual(
      put(formDataEdited(returnedData))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of editing the form data', () => {
    const api = { save: () => { } };
    const action= { payload: {} };
    const err = new Error();

    const iterator = saga.editFormDataAsync(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(formDataEdited(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });
});
