import { Forms } from '../../src/forms';
import { Router } from 'aurelia-router';
import { FormApi } from '../../src/api/form-api';
import { setupSpy} from './jasmine-helpers';

describe('the forms view model', () => {
  let sut;
  let routerSpy;
  let apiSpy;

  beforeEach(() => {
    routerSpy = setupSpy('router', Router.prototype);
    apiSpy = setupSpy('api', FormApi.prototype);
    sut = new Forms(routerSpy, apiSpy);
  });

  it('gets all the forms from the api', async done => {
    const expected = [ { id: 'b' } ];

    apiSpy.get.and.returnValue(expected);

    await sut.activate();

    expect(sut.forms).toBe(expected);
    done();
  });

  it('generates a route for a new form', async done => {
    apiSpy.get.and.returnValue([]);
    routerSpy.generate.and.returnValues(1);

    await sut.activate();

    expect(routerSpy.generate.calls.argsFor(0)).toEqual([ 'new-form' ]);
    expect(sut.routeToNew).toEqual(1);
    done();
  });

  it('generates a route for each form', async done => {
    const forms = [ { id: 'a' }, { id: 'b' }];

    apiSpy.get.and.returnValue(forms);
    routerSpy.generate.and.returnValues(0,1,2);

    await sut.activate();

    expect(routerSpy.generate.calls.argsFor(1)[0]).toEqual('dir', { form: 'a' });
    expect(routerSpy.generate.calls.argsFor(2)[0]).toEqual('dir', { form: 'a' });
    expect(forms[0].url).toEqual(1);
    expect(forms[1].url).toEqual(2);
    done();
  });
});
