import using from 'jasmine-data-provider';
import { HttpStub } from '../stubs';
import { MetadataApi } from '../../../src/api';

describe('the metadata api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new MetadataApi(httpStub);
  });

  it('fetches all the metadata from the form api', async done => {
    httpStub.itemStub = [];

    const response = await sut.get('a', 1);

    expect(httpStub.url).toEqual('a/1/metadata');
    expect(response).toBe(httpStub.itemStub);
    done();
  });
});
