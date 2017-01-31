import './setup';
import { Store } from 'aurelia-redux-plugin';
import { Directory } from '../../src/directory';
import { Router } from 'aurelia-router';
import * as utils from '../../src/utils';

describe('the directory view model', () => {
  let sut;
  let routerSpy;
  let storeSpy;
  let formStub;
  const params = { form: 'a' };

  beforeEach(() => {
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    routerSpy = jasmine.setupSpy('router', Router.prototype);
    sut = new Directory(routerSpy, storeSpy);
    formStub = {
      name: 'abc',
      files: [
        { priority: 1 }, { priority: 2 }
      ]
    };

    storeSpy.getState.and.returnValue({ forms: [ formStub ]});
    spyOn(utils, 'getForm').and.returnValue(formStub);
  });

  it('gets the specific form in the param from the store', () => {
    formStub.files = [];

    sut.activate(params);

    expect(sut.form).toBe(formStub);
  });

  it('sorts the files in ascending order', () => {
    // need a name so it does not error, but i don't care about that now
    routerSpy.routes = [ { name: '' } ];
    formStub.files = [
      { priority: 2, name: '' }, { priority: 1, name: '' }
    ]; 

    sut.activate(params);

    expect(formStub.files[0].priority).toEqual(1);
    expect(formStub.files[1].priority).toEqual(2);
  });

  it('throws when the route does not exist', () => {
    routerSpy.routes = [ { name: 'a' } ];
    formStub.files = [ { priority: 2, name: 'b' } ]; 

    const ex = () => sut.activate(params);

    expect(ex).toThrow(new Error('No route found for b'));
  });

  it('generates a route for each file', () => {
    routerSpy.routes = [ { name: 'a' }, { name: 'b' } ];
    formStub.files = [ { priority: 2, name: 'b' }, { priority: 1, name: 'a' } ]; 

    sut.activate(params);

    expect(routerSpy.generate.calls.count()).toEqual(2);
    expect(routerSpy.generate).toHaveBeenCalledWith('a', { form: 'abc' });
    expect(routerSpy.generate).toHaveBeenCalledWith('b', { form: 'abc' });
  });
});
