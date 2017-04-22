import { put, call, takeLatest } from 'redux-saga/effects';
import { receivedCurrentMember } from '../../../src/domain/index'
import * as saga from '../../../src/sagas/member-saga';

describe('the member saga', () => {

  it('watches the other functions', () => {
    const api = {};

    const iterator = saga.default(api);

    expect(iterator.next().value).toEqual(
      takeLatest('REQUEST_CURRENT_MEMBER', saga.getCurrentMember, api)
    );
    expect(iterator.next()).toEqual({
      done: true, value: undefined
    });
  });

  it('gets the current member', () => {
    const returnedData = { id: 1 };
    const api = { getCurrent: () => { } };

    const iterator = saga.getCurrentMember(api);

    expect(iterator.next().value).toEqual(
      call([api, api.getCurrent])
    );
    expect(iterator.next(returnedData).value).toEqual(
      put(receivedCurrentMember(returnedData))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of getting the form data', () => {
    const api = { getCurrent: () => { } };
    const err = new Error();

    const iterator = saga.getCurrentMember(api);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(receivedCurrentMember(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });
});
