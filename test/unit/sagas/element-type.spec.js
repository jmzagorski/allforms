import { put, call, takeLatest } from 'redux-saga/effects';
import { receivedElementTypes } from '../../../src/domain/index'
import * as saga from '../../../src/sagas/element-type';

describe('the element type saga', () => {

  it('watches the other functions', () => {
    const api = {};

    const iterator = saga.default(api);

    expect(iterator.next().value).toEqual(
      takeLatest('REQUEST_ELEMENT_TYPES', saga.getAllElementTypes, api)
    );
    expect(iterator.next()).toEqual({
      done: true, value: undefined
    });
  });

  it('gets the element types', () => {
    const api = { getAll: () => { } };

    const iterator = saga.getAllElementTypes(api, {});

    expect(iterator.next().value).toEqual(
      call([api, api.getAll])
    );
    expect(iterator.next(1).value).toEqual(
      put(receivedElementTypes(1))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of getting the element types', () => {
    const api = { getAll: () => { } };
    const err = new Error();

    const iterator = saga.getAllElementTypes(api, {});
    iterator.next();
    
    expect(iterator.throw(err).value).toEqual(
      put(receivedElementTypes(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });
});
