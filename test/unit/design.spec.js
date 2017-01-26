import {HttpStub} from './stubs';
import {Design} from '../../src/design';

describe('the design view model', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new Design(httpStub);
  });

  it('fetches the the form with elements', async done => {
    httpStub.itemStub = [];

    await sut.activate({form: 'testa'});

    expect(httpStub.url).toEqual('forms/testa/elements');
    done();
  });

  it('sets the form object to the json response', async done => {
    const form = {};
    httpStub.itemStub = form;

    await sut.activate({form: ''});

    expect(sut.form).toBe(form);
    done();
  });
});
