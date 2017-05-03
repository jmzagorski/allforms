import { HttpStub } from '../stubs';
import { FormDataApi } from '../../../src/api/index';

describe('the form data api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new FormDataApi(httpStub);
  });

  it('fetches all the form data list object by the master form id', async done => {
    httpStub.itemStub = [];

    const actual = await sut.getAll(1);

    expect(httpStub.url).toEqual('forms/1/data');
    expect(actual).toBe(httpStub.itemStub);
    done();
  });

  it('fetches a single form data object by the name', async done => {
    const expected = {};
    httpStub.itemStub = [ expected ];

    const actual = await sut.getByName('a');

    expect(httpStub.url).toEqual('forms/data?name=a');
    expect(actual).toBe(expected);
    done();
  });

  it('returns null if nothing found', async done => {
    // to test a null or undefined array
    httpStub.itemStub = null;

    const actual = await sut.getByName('a');

    expect(actual).not.toBeDefined();
    done();
  });

  using([
    { id: null, method: 'POST', url: 'forms/data' },
    { id: undefined, method: 'POST', url: 'forms/data' },
    { id: 0, method: 'POST', url: 'forms/data' },
    { id: 1, method: 'PUT', url: 'forms/data/1' }
  ], data => {
    it('saves the form data based on the id', async done => {
      const formData = { id: data.id, formName: 'test' }
      const returnedData = {};
      const fr = new FileReader();

      httpStub.itemStub = returnedData;

      fr.addEventListener('loadend', () => {
        expect(fr.result).toEqual(JSON.stringify(formData));
        done();
      });

      const actual = await sut.save(formData);

      expect(httpStub.url).toEqual(data.url);
      expect(httpStub.blob.method).toEqual(data.method);
      expect(actual).not.toBe(formData);
      expect(actual).toBe(returnedData);
      fr.readAsText(httpStub.blob.body);
    });
  });

  [ { method: 'snapshot', api: 'snapshots' },
    { method: 'copy', api: 'copy' }
  ].forEach(data => {
    it('uses the snapshot and copy api', async done => {
      const formData = { id: 123 };
      const returnedData = {};
      const fr = new FileReader();

      httpStub.itemStub = returnedData;

      fr.addEventListener('loadend', () => {
        expect(fr.result).toEqual(JSON.stringify({ originalId: formData.id}));
        done();
      });

      const actual = await sut[data.method](formData.id);

      expect(httpStub.url).toEqual(`forms/data/${data.api}`);
      expect(httpStub.blob.method).toEqual('POST');
      expect(actual).toBe(returnedData);
      fr.readAsText(httpStub.blob.body);
    });
  });

  it('saves for the form data', async done => {
    const formData = { id: 123 };
    const returnedData = {};

    httpStub.itemStub = returnedData;

    const actual = await sut.saveData(1, formData)

    expect(httpStub.url).toEqual('forms/data/1');
    expect(httpStub.blob.method).toEqual('PATCH');
    expect(actual).toBe(returnedData);
    expect(httpStub.blob.body).toBe(formData);
    done();
  });
});
