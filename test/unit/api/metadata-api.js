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

    const response = await sut.get({ api: 'a', form: 1 });

    expect(httpStub.url).toEqual('a/metadata/1');
    expect(response).toBe(httpStub.itemStub);
    done();
  });
});
