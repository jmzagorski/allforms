import {HttpStub} from './stubs';
import {Forms} from '../../src/forms';
import {Router} from 'aurelia-router';

describe('the forms view model', () => {
  let sut;
  let httpStub;
  let routerSpy;

  beforeEach(() => {
    httpStub = new HttpStub();
    routerSpy = jasmine.setupSpy('router', Router.prototype);
    sut = new Forms(httpStub, routerSpy);
  });

  it('fetches all the forms', async done => {
    httpStub.itemStub = [];

    await sut.activate();

    expect(httpStub.url).toEqual('forms');
    done();
  });

  it('sets the forms array to the json response', async done => {
    const forms = [];
    httpStub.itemStub = forms;

    await sut.activate();

    expect(sut.forms).toBe(forms);
    done();
  });

  it('generates a route for each form', async done => {
    const forms = [ { id: 1 }, { id: 2 }];
    httpStub.itemStub = forms;

    await sut.activate();

    expect(routerSpy.generate.calls.count()).toEqual(2);
    expect(routerSpy.generate).toHaveBeenCalledWith('dir', { form: 1 });
    expect(routerSpy.generate).toHaveBeenCalledWith('dir', { form: 2 });
    done();
  });
});
