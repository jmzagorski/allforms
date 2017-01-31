import { FormApi } from '../../../../src/api/form-api';
import { Store } from 'aurelia-redux-plugin';
import { FormActions } from '../../../../src/domain/index';

describe('the form actions', () => {
  var sut;
  var storeSpy;
  var apiSpy;

  beforeEach(() => {
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    apiSpy = jasmine.setupSpy('api', FormApi.prototype);
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
    { name: null, type: 'ADD_FORM_SUCCESS'},
    { name: undefined, type: 'ADD_FORM_SUCCESS'},
    { name: '', type: 'ADD_FORM_SUCCESS'},
    { name: 'a', type: 'EDIT_FORM_SUCCESS'}
  ], data => {
    it('adds the form if the name is not available', async done => {
      const form = { name: data.name };
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
});
