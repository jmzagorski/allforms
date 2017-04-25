import { Store } from 'aurelia-redux-plugin';
import { Directory } from '../../src/directory';
import { Router } from 'aurelia-router';
import { FormApi } from '../../src/api';
import { setupSpy } from './jasmine-helpers';
import * as formSelectors from '../../src/domain/form/selectors';
import * as metadataSelectors from '../../src/domain/metadata/selectors';
import * as memberSelectors from '../../src/domain/member/selectors';
import { requestMetadata } from '../../src/domain';

describe('the directory view model', () => {
  let sut;
  let routerSpy;
  let storeSpy;
  let formStub;
  let getFormSpy;
  let getStatusSpy;
  let apiSpy;
  const params = { form: 'a' };

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerSpy = setupSpy('router', Router.prototype);
    apiSpy = setupSpy('api', FormApi.prototype);
    getFormSpy = spyOn(formSelectors, 'getActiveForm');
    getStatusSpy = spyOn(metadataSelectors, 'getOverallMetadataStatus');

    sut = new Directory(routerSpy, storeSpy, apiSpy);
  });

  it('initializes the view model public props', () => {
    expect(sut.routes).toEqual([]);
    expect(sut.status).toEqual('muted');
  });

  it('returns the active from in the getter', () => {
    const state = {};
    const form = {};
    storeSpy.getState.and.returnValue(state);
    getFormSpy.and.returnValue(form);

    expect(sut.form).toBe(form);
    expect(getFormSpy.calls.argsFor(0)[0]).toBe(state);
  });

  it('dispatches requests to get the view model data', () => {
    sut.activate({ formName: 'a', memberId: 'b' });

    expect(storeSpy.dispatch.calls.argsFor(0)[0]).toEqual(requestMetadata('b', 'a'));
    expect(sut.formName).toEqual('a');
    expect(sut.memberId).toEqual('b');
  });

  it('listens for the form to update to get the routes', () => {
    let updateFunc = null;
    const state = {};
    routerSpy.routes = [{
      name: 'a',
      settings: { dirListing: true, icon: 'c', description: 'd' }
    }, {
      name: 'b',
      settings: { dirListing: true, icon: 'e', description: 'f' }
    }, {
      name: 'notshown', settings: {}
    }];

    storeSpy.getState.and.returnValue(state);
    getFormSpy.and.returnValue({ id: 1});
    routerSpy.generate.and.returnValues('/interface', '/g', '/h');
    // dont grab the second subscription for the status
    storeSpy.subscribe.and.callFake(func => {
      if (!updateFunc) updateFunc = func;
    });
    sut.activate({ memberId: 'membera', formName: 'someformname' });

    updateFunc();

    expect(getFormSpy.calls.argsFor(0)[0]).toBe(state);
    expect(routerSpy.generate.calls.count()).toEqual(3);
    expect(routerSpy.generate.calls.argsFor(0)[0]).toEqual('interface', {
      memberId: 'membera', formName: 'someformname'
    });
    expect(routerSpy.generate.calls.argsFor(1)[0]).toEqual('a', {
      memberId: 'membera', formName: 'someformname'
    });
    expect(routerSpy.generate.calls.argsFor(2)[0]).toEqual('b', {
      memberId: 'membera', formName: 'someformname'
    });
    expect(sut.routes).toEqual([{
      url: '/g', description: 'd', icon: 'c', name: 'a'
    }, {
      url: '/h', description: 'f', icon: 'e', name: 'b'
    }])
  });

  it('listens for the metadata status', () => {
    let updateFunc = null;
    const state = {};

    storeSpy.getState.and.returnValue(state);
    getStatusSpy.and.returnValue('goodtogo');
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({ });

    updateFunc();

    expect(getStatusSpy.calls.argsFor(0)[0]).toBe(state);
    expect(sut.status).toEqual('goodtogo');
  });

  // if you dont clear the routes any update may duplicate the routes
  it('refreshes the route array on each update', () => {
    let updateFunc = null;
    sut.routes = [ 1 ];
    routerSpy.routes = [];

    getFormSpy.and.returnValue({ });
    storeSpy.subscribe.and.callFake(func => {
      if (!updateFunc) updateFunc = func;
    });
    sut.activate({ });

    updateFunc();

    expect(sut.routes).toEqual([]);
  });

  it('does not generate routes when form does not exist', () => {
    let updateFunc = null;

    getFormSpy.and.returnValue(null);
    storeSpy.subscribe.and.callFake(func => updateFunc = func);
    sut.activate({ });

    updateFunc();

    expect(sut.routes).toEqual([]);
  });

  it('sends a copy request throught the form api', async done => {
    const state = {};
    const memberSpy = spyOn(memberSelectors, 'getActiveMember').and.returnValue({ id: 2 })

    getFormSpy.and.returnValue({ id: 1 });
    storeSpy.getState.and.returnValue(state);

    await sut.copy();

    expect(memberSpy.calls.argsFor(0)[0]).toBe(state);
    expect(apiSpy.copy.calls.count()).toEqual(1);
    expect(apiSpy.copy).toHaveBeenCalledWith(1, 2);
    done();
  });

  it('unsubscribes on deactivate', () => {
    let unsubscribe = 0;
    const subscription = () => ++unsubscribe;

    storeSpy.subscribe.and.returnValues(subscription, subscription);
    sut.activate({ });

    sut.deactivate();

    expect(unsubscribe).toEqual(2);
  });
});
