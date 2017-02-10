import '../setup';
import { HttpStub } from '../stubs';
import { TemplateApi } from '../../../src/api/template-api';

describe('the template api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new TemplateApi(httpStub);
  });

  it('fetches the template by form name', async done => {
    httpStub.itemStub = {};

    const actualTemplate = await sut.get('a');

    expect(httpStub.url).toEqual('forms/a/templates');
    expect(actualTemplate).toBe(httpStub.itemStub);
    done();
  });
});
