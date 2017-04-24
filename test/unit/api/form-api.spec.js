import { HttpStub } from '../stubs';
import { FormApi } from '../../../src/api/form-api';
import using from 'jasmine-data-provider';

describe('the form api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new FormApi(httpStub);
  });

  it('fetches all the forms', async done => {
    httpStub.itemStub = [];

    const actualForms = await sut.get();

    expect(httpStub.url).toEqual('forms');
    expect(actualForms).toBe(httpStub.itemStub);
    done();
  });

  it('fetches a single form', async done => {
    const id = 1;
    httpStub.itemStub = [];

    const actualForms = await sut.get(id);

    expect(httpStub.url).toEqual('forms/1');
    expect(actualForms).toBe(httpStub.itemStub);
    done();
  });

  it('fetches a the form for a member', async done => {
    const name = 'a';
    const memberId = 'b';
    const first = {};
    httpStub.itemStub = [ first ];

    const actualForms = await sut.getMemberForm(memberId, name);

    expect(httpStub.url).toEqual('forms?name=a&memberId=b');
    expect(actualForms).toBe(first);
    done();
  });

  it('returns null if nothing found for memeber form', async done => {
    // to test a null or undefined array
    httpStub.itemStub = null;

    const actual = await sut.getMemberForm('a', 'b');

    expect(actual).not.toBeDefined();
    done();
  });

  it('fetches a the form profile for a member', async done => {
    const name = 'a';
    const memberId = 'b';
    httpStub.itemStub = {};

    const actualForms = await sut.getProfile(memberId, name);

    expect(httpStub.url).toEqual('forms/profile/b/a');
    expect(actualForms).toBe(httpStub.itemStub);
    done();
  });

  [ { id: null, method: 'POST', url: 'forms' },
    { id: undefined, method: 'POST', url: 'forms' },
    { id: '', method: 'POST', url: 'forms' },
    { id: 'something', method: 'PUT', url: 'forms/something' }
  ].forEach(data => {
    it('puts or posts the form based on the id', async done => {
      const form = { id: data.id, summary: 'asda' };
      const returnedForm = {};
      const fr = new FileReader();

      httpStub.itemStub = returnedForm;
      fr.addEventListener('loadend', () => {
        expect(fr.result).toEqual(JSON.stringify(form));
        done();
      });

      const serverForm = await sut.save(form);

      expect(httpStub.url).toEqual(data.url);
      expect(httpStub.blob.method).toEqual(data.method);
      expect(serverForm).not.toBe(form);
      expect(serverForm).toBe(returnedForm);
      fr.readAsText(httpStub.blob.body);
    });
  });

  it('patches the form template', async done => {
    const form = { id: 1, template: 'test' }
    const returnedForm = {};
    const fr = new FileReader();

    httpStub.itemStub = returnedForm;
    fr.addEventListener('loadend', () => {
      expect(fr.result).toEqual(JSON.stringify(form));
      done();
    });

    const serverElem = await sut.saveTemplate(form);

    expect(httpStub.url).toEqual('forms/1');
    expect(httpStub.blob.method).toEqual('PATCH');
    expect(serverElem).not.toBe(form);
    expect(serverElem).toBe(returnedForm);
    fr.readAsText(httpStub.blob.body);
  });
});
