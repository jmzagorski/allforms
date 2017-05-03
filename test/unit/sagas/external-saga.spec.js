import { takeEvery, put, call } from 'redux-saga/effects';
import { postedExternalDataForm, formDataEdited, receivedExternalFormData } from '../../../src/domain/index'
import * as saga from '../../../src/sagas/external-saga';

describe('the external saga', () => {

  it('takes every local and external request', () => {
    const api = {};
    const xhr = {};
    const env = {};

    const iterator = saga.default(api, xhr, env);
    const first = iterator.next().value.FORK;
    const second = iterator.next().value.FORK;

    expect(first.args[1]).toBe(saga.saveLocal);
    expect(first.args[2]).toBe(api);
    expect(second.args[1]).toBe(saga.saveExternal);
    expect(second.args[2]).toBe(xhr);
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  [ { isLocal: true, type: 'EDIT_DATA_ON_FORM', firstTest: true, secondTest: false, calls: 2 },
    { isLocal: false, type: 'EDIT_DATA_ON_FORM', firstTest: false, secondTest: true, calls: 2 },
    { isLocal: false, type: 'BLAH', firstTest: false, secondTest: false, calls: 0 }
  ].forEach(rec => {
    it('tests to see if the action is local or external', () => {
      const api = {};
      const xhr = {};
      const env = { isLocalApi: jasmine.createSpy('isLocal') };
      const action = { type: rec.type, payload: { api: 'a' } };
      env.isLocalApi.and.returnValue(rec.isLocal);

      const iterator = saga.default(api, xhr, env);
      const first = iterator.next().value.FORK;
      const second = iterator.next().value.FORK;

      const firstTest = first.args[0](action);
      const secondTest = second.args[0](action);

      expect(firstTest).toEqual(rec.firstTest);
      expect(secondTest).toEqual(rec.secondTest);
      expect(env.isLocalApi.calls.count()).toEqual(rec.calls);

      if (rec.type !== 'BLAH') {
        expect(env.isLocalApi).toHaveBeenCalledWith('a');
      }
    });
  });

  [ { returnedData: { id: 1}, hasError: false },
    { returnedData: null, hasError: true },
    { returnedData: undefined, hasError: true }
  ].forEach(rec => {
    it('saves the local data', () => {
      const api = { saveData: () => { } };
      const action = { payload: { formDataId: 2, formData: {} } };

      const iterator = saga.saveLocal(api, action);

      expect(iterator.next().value).toEqual(
        call([api, api.saveData], 2, action.payload.formData)
      );
      expect(iterator.next(rec.returnedData).value).toEqual(
        put(formDataEdited(rec.returnedData, rec.hasError))
      );
      expect(iterator.next()).toEqual({
        done: true,
        value: undefined
      });
    });
  });

  it('sends an error in the catch of editing the local data', () => {
    const api = { saveData: () => { } };
    const action= { payload: {} };
    const err = new Error();

    const iterator = saga.saveLocal(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(formDataEdited(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  [ { returnedData: { id: 1}, hasError: false },
    { returnedData: null, hasError: true },
    { returnedData: undefined, hasError: true }
  ].forEach(rec => {
    it('saves the external data', () => {
      const api = { send: () => { } };
      const action = { payload: { formDataId: 2, api: 'a', formData: {} } };

      const iterator = saga.saveExternal(api, action);

      expect(iterator.next().value).toEqual(
        call([api, api.send], 'POST', 'a', action.payload.formData)
      );
      expect(iterator.next(rec.returnedData).value).toEqual(
        put(postedExternalDataForm(action.payload.formDataId, rec.returnedData, rec.hasError))
      );
      expect(iterator.next()).toEqual({
        done: true,
        value: undefined
      });
    });
  });

  it('sends an error in the catch of editing the external data', () => {
    const api = { send: () => { } };
    const action= { payload: {} };
    const err = new Error();

    const iterator = saga.saveExternal(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(postedExternalDataForm(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });
});
