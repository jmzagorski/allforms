import '../setup';
import { HttpStub } from '../stubs';
import { TemplateApi } from '../../../src/api/template-api';
import using from 'jasmine-data-provider';

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

    expect(httpStub.url).toEqual('templates/a');
    expect(actualTemplate).toBe(httpStub.itemStub);
    done();
  });

  using([
    { id: null, method: 'POST' },
    { id: undefined, method: 'POST' },
    { id: 0, method: 'POST' },
    { id: 1, method: 'PUT' }
  ], data => {
    it('saves the new template based on the id', async done => {
      const template = { id: data.id, formName: 'test' }
      const returnedTemplate = {};
      const fr = new FileReader();

      httpStub.itemStub = returnedTemplate;
      fr.addEventListener('loadend', () => {
        expect(fr.result).toEqual(JSON.stringify(template));
        done();
      });

      const serverTemplate = await sut.save(template);

      expect(httpStub.url).toEqual('templates');
      expect(httpStub.blob.method).toEqual(data.method);
      expect(serverTemplate).not.toBe(template);
      expect(serverTemplate).toBe(returnedTemplate);
      fr.readAsText(httpStub.blob.body);
    });
  });
});
