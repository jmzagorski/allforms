import '../setup';
import { HttpStub } from '../stubs';
import { FormApi } from '../../../src/api/form-api';

describe('the form api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new FormApi(httpStub);
  });

  it('fetches all the forms', async done => {
    httpStub.itemStub = [];

    const actualForms = await sut.getAll();

    expect(httpStub.url).toEqual('forms');
    expect(actualForms).toBe(httpStub.itemStub);
    done();
  });

  using([
    { name: null, method: 'POST' },
    { name: undefined, method: 'POST' },
    { name: '', method: 'POST' },
    { name: 'something', method: 'PUT' }
  ], data => {
    it('saves the new form based on the name', async done => {
      const form = { name: data.name, summary: 'asda' };
      const returnedForm = {};
      const fr = new FileReader();

      httpStub.itemStub = returnedForm;
      fr.addEventListener('loadend', () => {
        expect(fr.result).toEqual(JSON.stringify(form));
        done();
      });

      const serverForm = await sut.save(form);

      expect(httpStub.url).toEqual('forms');
      expect(httpStub.blob.method).toEqual(data.method);
      expect(serverForm).not.toBe(form);
      expect(serverForm).toBe(returnedForm);
      fr.readAsText(httpStub.blob.body);
    });
  });
});
