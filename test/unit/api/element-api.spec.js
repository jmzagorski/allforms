import '../setup';
import using from 'jasmine-data-provider';
import { HttpStub } from '../stubs';
import { ElementApi } from '../../../src/api/element-api';

describe('the element api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new ElementApi(httpStub);
  });

  it('fetches all the elements for the form', async done => {
    httpStub.itemStub = [];

    const actualElems = await sut.getAllFor('test');

    expect(httpStub.url).toEqual('forms/test/elements');
    expect(actualElems).toBe(httpStub.itemStub);
    done();
  });

  using([
    { id: null, method: 'POST' },
    { id: undefined, method: 'POST' },
    { id: 0, method: 'POST' },
    { id: 1, method: 'PUT' }
  ], data => {
    it('saves the new element based on the id', async done => {
      const elem = { id: data.id, formName: 'test' }
      const returnedElem = {};
      const fr = new FileReader();

      httpStub.itemStub = returnedElem;
      fr.addEventListener('loadend', () => {
        expect(fr.result).toEqual(JSON.stringify(elem));
        done();
      });

      const serverElem = await sut.save(elem);

      expect(httpStub.url).toEqual('elements');
      expect(httpStub.blob.method).toEqual(data.method);
      expect(serverElem).not.toBe(elem);
      expect(serverElem).toBe(returnedElem);
      fr.readAsText(httpStub.blob.body);
    });
  });
});
