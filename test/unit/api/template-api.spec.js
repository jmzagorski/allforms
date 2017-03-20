import { HttpStub } from '../stubs';
import { TemplateApi } from '../../../src/api/index';
import using from 'jasmine-data-provider';

describe('the template api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new TemplateApi(httpStub);
  });

  it('fetches the template by form id', async done => {
    httpStub.itemStub = {};

    const actualTemplate = await sut.get('a');

    expect(httpStub.url).toEqual('templates/a');
    expect(actualTemplate).toBe(httpStub.itemStub);
    done();
  });

  using([ 
    { method: 'POST', url: 'templates' },
    { method: 'PUT', url: 'templates/a'}
  ], data => {
    it('saves the new template for put and post', async done => {
      const template = { id: 'a' };
      const returnedTemplate = {};
      const fr = new FileReader();
      let serverTemplate;

      httpStub.itemStub = returnedTemplate;
      fr.addEventListener('loadend', () => {
        expect(fr.result).toEqual(JSON.stringify(template));
        done();
      });

      serverTemplate = await (data.method === 'POST' ? sut.add(template) : sut.edit(template));

      expect(httpStub.url).toEqual(data.url);
      expect(httpStub.blob.method).toEqual(data.method);
      expect(serverTemplate).not.toBe(template);
      expect(serverTemplate).toBe(returnedTemplate);
      fr.readAsText(httpStub.blob.body);
    });
  });
});
