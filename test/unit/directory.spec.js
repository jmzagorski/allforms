import {HttpStub} from './stubs';
import {Directory} from '../../src/directory';
import {Router} from 'aurelia-router';

describe('the directory view model', () => {
  let sut;
  let httpStub;
  let routerSpy;
  let formStub;
  const params = { form: 'a' };

  beforeEach(() => {
    httpStub = new HttpStub();
    routerSpy = jasmine.setupSpy('router', Router.prototype);
    sut = new Directory(httpStub, routerSpy);
    formStub = {
      id: 0,
      files: [
        { priority: 1 }, { priority: 2 }
      ]
    }
  });

  it('fetches the specific form in the param', async done => {
    formStub.files = [];
    httpStub.itemStub = formStub;

    await sut.activate(params);

    expect(httpStub.url).toEqual('forms/a');
    done();
  });

  it('sets the form to the json reponse', async done => {
    formStub.files = [];
    httpStub.itemStub = formStub;

    await sut.activate(params);

    expect(sut.form).toBe(formStub);
    done();
  });

  it('sorts the files in ascending order', async done => {
    // need a name so it does not error, but i don't care about that now
    routerSpy.routes = [ { name: '' } ];
    formStub.files = [
      { priority: 2, name: '' }, { priority: 1, name: '' }
    ]; 
    httpStub.itemStub = formStub;

    await sut.activate(params);

    expect(formStub.files[0].priority).toEqual(1);
    expect(formStub.files[1].priority).toEqual(2);
    done();
  });

  it('throws when the route does not exist', async done => {
    routerSpy.routes = [ { name: 'a' } ];
    formStub.files = [ { priority: 2, name: 'b' } ]; 
    httpStub.itemStub = formStub;

    try {
      return await sut.activate(params)
    } catch (err) {
      expect(err).toEqual(new Error('No route found for b'));
      done();
    }
  });

  it('generates a route for each file', async done => {
    formStub.id = 5;
    routerSpy.routes = [ { name: 'a' }, { name: 'b' } ];
    formStub.files = [ { priority: 2, name: 'b' }, { priority: 1, name: 'a' } ]; 
    httpStub.itemStub = formStub;

    await sut.activate(params);

    expect(routerSpy.generate.calls.count()).toEqual(2);
    expect(routerSpy.generate).toHaveBeenCalledWith('a', { form: 5 });
    expect(routerSpy.generate).toHaveBeenCalledWith('b', { form: 5 });
    done();
  });
});
