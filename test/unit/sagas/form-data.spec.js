import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
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
    expect(iterator.next().value).toEqual(
      takeEvery('POSTED_EXTERNAL_DATA_FORM', saga.saveDataOnlyAsync, api)
    );
    expect(iterator.next()).toEqual({
      done: true, value: undefined
    });
  });

  it('gets the form data', () => {
    const returnedData = { id: 1 };
    const api = { getByName: () => { } };
    const action= { payload: { name: 1 } };

    const iterator = saga.getFormDataAsync(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.getByName], action.payload.name)
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
    const api = { getByName: () => { } };
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

  it('saves the data only for the form data', () => {
    const returnedData = { id: 1 };
    const api = { saveData: () => { } };
    const action = { payload: { formDataId: 2, formData: {} } };

    const iterator = saga.saveDataOnlyAsync(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.saveData], 2, action.payload.formData)
    );
    expect(iterator.next(returnedData).value).toEqual(
      put(formDataEdited(returnedData))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of editing the data on the form data object', () => {
    const api = { saveData: () => { } };
    const action = { payload: {} };
    const err = new Error();

    const iterator = saga.saveDataOnlyAsync(api, action);
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
