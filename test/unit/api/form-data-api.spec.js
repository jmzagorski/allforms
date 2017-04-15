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

    expect(httpStub.url).toEqual('forms/1/form-data');
    expect(actual).toBe(httpStub.itemStub);
    done();
  });

  it('fetches a single form data object by the id', async done => {
    httpStub.itemStub = {};

    const actual = await sut.get(1);

    expect(httpStub.url).toEqual('form-data/1');
    expect(actual).toBe(httpStub.itemStub);
    done();
  });

  using([
    { id: null, method: 'POST', url: 'form-data' },
    { id: undefined, method: 'POST', url: 'form-data' },
    { id: 0, method: 'POST', url: 'form-data' },
    { id: 1, method: 'PUT', url: 'form-data/1' }
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

  [ { method: 'snapshot', api: 'snapshots', prop: 'originalId' },
    { method: 'copy', api: 'copy', prop: 'parentId' }
  ].forEach(data => {
    it('uses the snapshot api', async done => {
      const formData = { id: 123 };
      const returnedData = {};
      const fr = new FileReader();

      httpStub.itemStub = returnedData;

      fr.addEventListener('loadend', () => {
        expect(fr.result).toEqual(JSON.stringify({ [data.prop]: formData.id}));
        done();
      });

      const actual = await sut[data.method](formData.id);

      expect(httpStub.url).toEqual(`form-data/${data.api}`);
      expect(httpStub.blob.method).toEqual('POST');
      expect(actual).toBe(returnedData);
      fr.readAsText(httpStub.blob.body);
    });
  });
});
