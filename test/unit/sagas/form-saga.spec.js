import { put, call, takeLatest, select } from 'redux-saga/effects';
import { receivedForm, formAdded, formEdited, getActiveForm } from '../../../src/domain/index'
import * as saga from '../../../src/sagas/form-saga';

describe('the form saga', () => {

  it('watches the other functions', () => {
    const api = {};

    const iterator = saga.default(api);

    expect(iterator.next().value).toEqual(
      takeLatest('REQUEST_FORM', saga.getForm, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('CREATE_FORM', saga.addForm, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('EDIT_FORM', saga.editForm, api)
    );
    expect(iterator.next().value).toEqual(
      takeLatest('EDIT_FORM_TEMPLATE', saga.editTemplate, api)
    );
    expect(iterator.next()).toEqual({
      done: true, value: undefined
    });
  });

  [ { form: undefined, error: true },
    { form: null, error: true },
    { form: {}, error: false} 
  ].forEach(data => {
    it('gets the form', () => {
      const api = { get: () => { } };
      const action= { payload: { id: 1 } };

      const iterator = saga.getForm(api, action);

      expect(iterator.next().value).toEqual(
        call([api, api.get], action.payload.id)
      );
      expect(iterator.next(data.form).value).toEqual(
        put(receivedForm(data.form, data.error))
      );
      expect(iterator.next()).toEqual({
        done: true,
        value: undefined
      });
    });
  });

  it('sends an error in the catch of getting the form', () => {
    const api = { get: () => { } };
    const action= { payload: { id: 1 } };
    const err = new Error();

    const iterator = saga.getForm(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(receivedForm(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  [ null, undefined, '', 0 ].forEach(id => {
    it('has no iterator when payload id is missing', () => {
      const action= { payload: { id } };

      const iterator = saga.getForm(null, action);

      expect(iterator.next()).toEqual({
        done: true,
        value: undefined
      });
    });
  });

  it('adds the form', () => {
    const api = { save: () => { } };
    const action= { payload: {} };
    const form = {};

    const iterator = saga.addForm(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.save], action.payload)
    );
    expect(iterator.next(form).value).toEqual(
      put(formAdded(form))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of add form', () => {
    const api = { save: () => { } };
    const action= { payload: 1 };
    const err = new Error();

    const iterator = saga.addForm(api, action);
    iterator.next()

    expect(iterator.throw(err).value).toEqual(
      put(formAdded(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('edits the form', () => {
    const api = { save: () => { } };
    const action= { payload: {} };
    const form = {};

    const iterator = saga.editForm(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.save], action.payload)
    );
    expect(iterator.next(form).value).toEqual(
      put(formEdited(form))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of edit form', () => {
    const api = { save: () => { } };
    const action= { payload: 1 };
    const err = new Error();

    const iterator = saga.editForm(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(formEdited(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('edits the form template', () => {
    const api = { saveTemplate: () => { } };
    const action= { payload: { form: { id: 1 } } };
    const form = { id: 2 };

    const iterator = saga.editTemplate(api, action);

    expect(iterator.next().value).toEqual(
      call([api, api.saveTemplate], action.payload.form)
    );
    expect(iterator.next(form).value).toEqual(
      put(formEdited(form))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });

  it('sends an error in the catch of edit form template', () => {
    const api = { saveTemplate: () => { } };
    const action= { payload: { form: {} } };
    const err = new Error();

    const iterator = saga.editTemplate(api, action);
    iterator.next();

    expect(iterator.throw(err).value).toEqual(
      put(formEdited(err, true))
    );
    expect(iterator.next()).toEqual({
      done: true,
      value: undefined
    });
  });
});
