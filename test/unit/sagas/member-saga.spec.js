import { put, call, takeLatest } from 'redux-saga/effects';
import { receivedCurrentMember, receivedForms, receivedDataForms } from '../../../src/domain'
import * as saga from '../../../src/sagas/member-saga';

describe('the member saga', () => {

  it('watches for current member action before forking activity', () => {
    const api = {};

    const iterator = saga.default(api);

    expect(iterator.next().value).toEqual(
      takeLatest('REQUEST_CURRENT_MEMBER', saga.getCurrentMember, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('REQUEST_MEMBER_ACTIVITY', saga.getRecentForms, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('REQUEST_MEMBER_ACTIVITY', saga.getRecentDataForms, api)
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
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

  it('gets the recent forms', () => {
    const returnedData = [ { id: 1 } ];
    const api = { getRecentForms: () => { } };
    const action = {
      payload: { memberId: 1 }
    };

    const iterator = saga.getRecentForms(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.getRecentForms], 1)
    );
    expect(iterator.next(returnedData).value).toEqual(
      put(receivedForms(returnedData))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of getting the form list', () => {
    const api = { getRecentForms: () => { } };
    const err = new Error();

    const iterator = saga.getRecentForms(api, { payload: {}});
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(receivedForms(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('gets the recent data forms', () => {
    const returnedData = [ { id: 1 } ];
    const api = { getRecentDataForms: () => { } };
    const action = {
      payload: { memberId: 1 }
    };

    const iterator = saga.getRecentDataForms(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.getRecentDataForms], 1)
    );
    expect(iterator.next(returnedData).value).toEqual(
      put(receivedDataForms(returnedData))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of getting the form data list', () => {
    const api = { getRecentDataForms: () => { } };
    const err = new Error();

    const iterator = saga.getRecentDataForms(api, { payload: {}});
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(receivedDataForms(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });
});
