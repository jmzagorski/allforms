import { Store } from 'aurelia-redux-plugin';
import { Router } from 'aurelia-router';
import { setupSpy } from './jasmine-helpers';
import { Home } from '../../src/home';
import { requestMemberActivity } from '../../src/domain';
import * as memberSelectors from '../../src/domain/member/selectors';
import * as formSelectors from '../../src/domain/form/selectors';
import * as formDataSelectors from '../../src/domain/form-data/selectors';

describe('the home view model', () => {
  let sut;
  let storeSpy;
  let routerSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerSpy = setupSpy('router', Router.prototype);
    sut = new Home(storeSpy, routerSpy);
  });

  it('initializes the view model', () => {
    expect(sut.activity).toEqual([]);
    expect(sut.forms).toEqual([]);
    expect(sut.contributions).toEqual([]);
    expect(sut.datum).toEqual([]);
    expect(storeSpy.subscribe.calls.count()).toEqual(1);
  });

  it('dispatches to get the current member activity on activate', () => {
    // make sure update is not called in this test
    spyOn(memberSelectors, 'getActiveMember').and.returnValue({ id: 1 });
    // skip the logic in this test
    spyOn(formSelectors, 'getFormList').and.returnValue(null);
    spyOn(formDataSelectors, 'getDataFormList').and.returnValue(null);

    sut.activate();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestMemberActivity(1));
    expect(sut.memberId).toEqual(1);
  });

  it('updates the view model on activate', () => {
    const state = {};
    const forms = [ { name: 'a', memberId: 2 }, { name: 'b', memberId: 3 } ];
    const dataForms = [
      { name: 'c', form: { name: 'd', memberId: 4 } },
      { name: 'e', form: { name: 'f', memberId: 5 } }
    ];
    const member = { id: 1 };
    const memberSpy = spyOn(memberSelectors, 'getActiveMember').and.returnValue(member);
    const formListSpy = spyOn(formSelectors, 'getFormList').and.returnValue(forms);
    const dataListSpy = spyOn(formDataSelectors, 'getDataFormList').and.returnValue(dataForms);
    
    routerSpy.generate.and.returnValues('g', 'h', 'i', 'j');
    storeSpy.getState.and.returnValue(state);

    sut.activate();

    expect(memberSpy.calls.argsFor(0)[0]).toBe(state);
    expect(formListSpy.calls.argsFor(0)[0]).toBe(state);
    expect(dataListSpy.calls.argsFor(0)[0]).toBe(state);
    expect(routerSpy.generate.calls.argsFor(0)[0]).toEqual('dir');
    expect(routerSpy.generate.calls.argsFor(1)[0]).toEqual('dir');
    expect(routerSpy.generate.calls.argsFor(2)[0]).toEqual('formData');
    expect(routerSpy.generate.calls.argsFor(3)[0]).toEqual('formData');
    expect(routerSpy.generate.calls.argsFor(0)[1]).toEqual({ memberId: 2, formName: 'a' });
    expect(routerSpy.generate.calls.argsFor(1)[1]).toEqual({ memberId: 3, formName: 'b' });
    expect(routerSpy.generate.calls.argsFor(2)[1]).toEqual(
      { memberId: 4, formName: 'd', formDataName: 'c' }
    );
    expect(routerSpy.generate.calls.argsFor(3)[1]).toEqual(
      { memberId: 5, formName: 'f', formDataName: 'e' }
    );
    expect(sut.forms).toEqual([ { name: 'a', url: 'g' }, { name: 'b', url: 'h' } ])
    expect(sut.datum).toEqual([
      { display: 'd/c', url: 'i' }, { display: 'f/e', url: 'j' }
    ]);
  });

  it('refreshes the forms and datum properties on each refresh', () => {
    let update = null;
    const forms = [ { name: 'a' } ];
    const dataForms = [ { name: 'c', form: { name: 'd' } } ];
    spyOn(memberSelectors, 'getActiveMember').and.returnValue({ id: 1 });
    spyOn(formSelectors, 'getFormList').and.returnValues(forms, forms);
    spyOn(formDataSelectors, 'getDataFormList').and.returnValues(dataForms, dataForms);
    
    storeSpy.subscribe.and.callFake(func => update = func);
    sut = new Home(storeSpy, routerSpy);

    sut.activate();
    update();

    expect(sut.forms).toEqual([ { name: 'a', url: undefined } ])
    expect(sut.datum).toEqual([ { display: 'd/c', url: undefined } ]);
  });

  it('unsubscribes on deactivate', () => {
    let unsubscribe = 0;
    const subscription = () => ++unsubscribe;

    storeSpy.subscribe.and.returnValues(subscription);

    sut = new Home(storeSpy, routerSpy);

    sut.deactivate();

    expect(unsubscribe).toEqual(1);
  });
});
