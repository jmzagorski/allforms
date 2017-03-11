import { FormApi } from '../../../../src/api/form-api';
import { Store } from '../../../../src/config/store';
import {
  FormActions,
  activateFormSuccess
} from '../../../../src/domain/index';
import { setupSpy } from '../../jasmine-helpers';
import using from 'jasmine-data-provider';

describe('the form actions', () => {
  var sut;
  var storeSpy;
  var apiSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    apiSpy = setupSpy('api', FormApi.prototype);
    sut = new FormActions(apiSpy, storeSpy);
  });

  it('loads all the forms', async done => {
    const forms = [];

    apiSpy.getAll.and.returnValue(forms);

    await sut.loadForms();

    expect(storeSpy.dispatch).toHaveBeenCalledWith({
      type: 'LOAD_FORMS_SUCCESS', forms
    });
    expect(storeSpy.dispatch.calls.argsFor(0)[0].forms).toBe(forms);
    done();
  });

  using([
    { id: null, type: 'ADD_FORM_SUCCESS'},
    { id: undefined, type: 'ADD_FORM_SUCCESS'},
    { id: '', type: 'ADD_FORM_SUCCESS'},
    { id: 'a', type: 'EDIT_FORM_SUCCESS'}
  ], data => {
    it('adds the form if the id is not available', async done => {
      const form = { id: data.id };
      const serverForm = { };

      apiSpy.save.and.returnValue(serverForm);

      await sut.saveForm(form);

      expect(apiSpy.save).toHaveBeenCalledWith(form);
      expect(storeSpy.dispatch).toHaveBeenCalledWith({
        type: data.type, form: serverForm
      });
      expect(storeSpy.dispatch.calls.argsFor(0)[0].form).toBe(serverForm);
      done();
    });
  });

  it('has a form activated action', () => {
    const action = activateFormSuccess('a');

    expect(action).toEqual({
      type: 'ACTIVATE_FORM_SUCCESS',
      id: 'a'
    });
  })
});
