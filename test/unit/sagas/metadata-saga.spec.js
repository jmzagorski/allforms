import { put, call, take, fork } from 'redux-saga/effects';
import { receivedMetadata } from '../../../src/domain/index'
import * as saga from '../../../src/sagas/metadata-saga';

describe('the metadata saga', () => {

  it('watches for two actions to happen before forking', () => {
    const api = {};
    const form = {};

    const iterator = saga.default(api);

    expect(iterator.next().value).toEqual(
      take('REQUEST_METADATA')
    );
    expect(iterator.next().value).toEqual(
      take('RECEIVED_FORM')
    );
    expect(iterator.next(form).value).toEqual(
      fork(saga.getMetadata, api, form)
    );
    // must go back to the beginning of the loop
    expect(iterator.next().value).toEqual(
      take('REQUEST_METADATA')
    );
  });

  [ { metadata: undefined, error: true },
    { metadata: null, error: true },
    { metadata: [], error: false} 
  ].forEach(rec => {
    it('gets all the metadata', () => {
      const api = { get: () => { } };
      const action= { payload: { api: 'a', id: 1 } };

      const iterator = saga.getMetadata(api, action);

      expect(iterator.next().value).toEqual(
        call([api, api.get], 'a', 1)
      );
      expect(iterator.next(rec.metadata).value).toEqual(
        put(receivedMetadata(rec.metadata, rec.error))
      );
      expect(iterator.next()).toEqual({
        done: true,
        value: undefined
      });
    });
  });

  it('sends an error in the catch of getting the metadata', () => {
    const api = { get: () => { } };
    const action= { payload: { api: 'a', id: 1 } };
    const err = new Error();

    const iterator = saga.getMetadata(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(receivedMetadata(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });
});
