import './setup';
import { Store } from 'aurelia-redux-plugin';
import { Directory } from '../../src/directory';
import { Router } from 'aurelia-router';
import * as selectors from '../../src/domain/form/form-selectors';

describe('the directory view model', () => {
  let sut;
  let routerSpy;
  let storeSpy;
  let formStub;
  let getFormSpy;
  const params = { form: 'a' };

  beforeEach(() => {
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    routerSpy = jasmine.setupSpy('router', Router.prototype);
    getFormSpy = spyOn(selectors, 'getActiveForm');

    sut = new Directory(routerSpy, storeSpy);
    formStub = {
      name: 'abc',
      files: [
        { priority: 1 }, { priority: 2 }
      ]
    };

    storeSpy.getState.and.returnValue({ forms: { list: [ formStub ] } });
    getFormSpy.and.returnValue(formStub);
  });

  it('gets the form', () => {
    formStub.files = [];
    storeSpy.getState.and.returnValue('a');

    const actualForm = sut.form;

    expect(actualForm).toBe(formStub);
    expect(getFormSpy).toHaveBeenCalledWith('a');
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
