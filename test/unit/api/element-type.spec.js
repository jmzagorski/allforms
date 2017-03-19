import { HttpStub } from '../stubs';
import { ElementTypeApi } from '../../../src/api/element-type';

describe('the element type api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new ElementTypeApi(httpStub);
  });

  it('fetches all the element types', async done => {
    httpStub.itemStub = [];

    const actualTypes = await sut.getAll();

    expect(httpStub.url).toEqual('element-types');
    expect(actualTypes).toBe(httpStub.itemStub);
    done();
  });
});
