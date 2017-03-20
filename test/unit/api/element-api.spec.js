import using from 'jasmine-data-provider';
import { HttpStub } from '../stubs';
import { ElementApi } from '../../../src/api/index';

describe('the element api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new ElementApi(httpStub);
  });

  it('fetches the elements by id', async done => {
    httpStub.itemStub = [];

    const actualElems = await sut.get(1);

    expect(httpStub.url).toEqual('elements/1');
    expect(actualElems).toBe(httpStub.itemStub);
    done();
  });

  using([
    { id: null, method: 'POST', url: 'elements' },
    { id: undefined, method: 'POST', url: 'elements' },
    { id: 0, method: 'POST', url: 'elements' },
    { id: 1, method: 'PUT', url: 'elements/1' }
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

      expect(httpStub.url).toEqual(data.url);
      expect(httpStub.blob.method).toEqual(data.method);
      expect(serverElem).not.toBe(elem);
      expect(serverElem).toBe(returnedElem);
      fr.readAsText(httpStub.blob.body);
    });
  });
});
