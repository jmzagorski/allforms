import { Forms } from '../../src/forms';
import { Router } from 'aurelia-router';
import { MemberApi } from '../../src/api/member-api';
import { setupSpy} from './jasmine-helpers';

describe('the forms view model', () => {
  let sut;
  let routerSpy;
  let apiSpy;

  beforeEach(() => {
    routerSpy = setupSpy('router', Router.prototype);
    apiSpy = setupSpy('api', MemberApi.prototype);
    sut = new Forms(routerSpy, apiSpy);
  });

  it('gets all the forms from the member api', async done => {
    const expected = [ { id: 'b' } ];
    const memberId = 'a';

    apiSpy.getForms.and.returnValue(expected);

    await sut.activate({ memberId });

    expect(sut.forms).toBe(expected);
    expect(apiSpy.getForms).toHaveBeenCalledWith(memberId);
    done();
  });

  it('generates a route for a new form', async done => {
    apiSpy.getForms.and.returnValue([]);
    routerSpy.generate.and.returnValues(1);

    await sut.activate({ memberId: 'a' });

    expect(routerSpy.generate.calls.argsFor(0)[0]).toEqual('new-form');
    expect(routerSpy.generate.calls.argsFor(0)[1]).toEqual({ memberId: 'a'});
    expect(sut.routeToNew).toEqual(1);
    done();
  });

  it('generates a route for each form', async done => {
    const forms = [ { name: 'a' }, { name: 'b' }];
    const memberId = 'c';

    apiSpy.getForms.and.returnValue(forms);
    routerSpy.generate.and.returnValues(0,1,2);

    await sut.activate({ memberId });

    expect(routerSpy.generate.calls.argsFor(1)[0]).toEqual('dir', {
      memberId, formName: 'a'
    });
    expect(routerSpy.generate.calls.argsFor(2)[0]).toEqual('dir', {
      memberId, formName: 'b'
    });
    expect(forms[0].url).toEqual(1);
    expect(forms[1].url).toEqual(2);
    done();
  });
});
