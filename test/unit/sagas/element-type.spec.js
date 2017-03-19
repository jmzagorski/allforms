import { put, call, takeLatest } from 'redux-saga/effects';
import { receivedElementTypes } from '../../../src/domain/index'
import * as saga from '../../../src/sagas/element-type';

describe('the element type saga', () => {

  it('watches the other functions', () => {
    const api = {};
  
    const iterator = saga.default(api);
    const expected = takeLatest('REQUEST_ELEMENT_TYPES', saga.getAllElementTypes, api);

    const actual = iterator.next().value;

    expect(actual).toEqual(expected)
  })

  it('gets the element types', () => {
    const api = { getAll: () => { } };
    const action= {};

    const iterator = saga.getAllElementTypes(api, action);

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
  })
});
