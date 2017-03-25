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

  it('generates a route for each form', async done => {
    const forms = [ { id: 'a' }, { id: 'b' }];

    apiSpy.get.and.returnValue(forms);
    routerSpy.generate.and.returnValues(1,2);

    await sut.activate();

    expect(routerSpy.generate.calls.count()).toEqual(2);
    expect(routerSpy.generate).toHaveBeenCalledWith('dir', { form: 'a' });
    expect(routerSpy.generate).toHaveBeenCalledWith('dir', { form: 'b' });
    expect(forms[0].url).toEqual(1);
    expect(forms[1].url).toEqual(2);
    done();
  });
});
