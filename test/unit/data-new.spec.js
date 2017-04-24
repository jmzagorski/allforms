import { Router } from 'aurelia-router';
import { Store } from 'aurelia-redux-plugin';
import { DataNew } from '../../src/data-new';
import { setupSpy } from './jasmine-helpers';
import { createFormData } from '../../src/domain';
import * as memberSelectors from '../../src/domain/member/selectors';
import * as formSelectors from '../../src/domain/form/selectors';

describe('the new data form view model', () => {
  let storeSpy;
  let routerSpy;
  let sut;
  let getFormSpy;
  let getCurrentMemberSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    routerSpy = setupSpy('router', Router.prototype);
    sut = new DataNew(storeSpy, routerSpy);
    getFormSpy = spyOn(formSelectors, 'getActiveForm');
    getCurrentMemberSpy = spyOn(memberSelectors, 'getActiveMember');
  });

  it('initializes the view model with default property values', () => {
    expect(sut.model).not.toEqual(null);
    expect(sut.formName).toBeDefined();
    expect(sut.memberId).toBeDefined();
    expect(sut.hasAutoName).toBeFalsy();
    expect(storeSpy.subscribe.calls.count()).toEqual(1);
  });

  it('populates view model properties on activate', () => {
    const params = { memeberId: 1, formName: 'a' };

    sut.activate(params);

    expect(sut.memberId).toEqual(params.memberId);
    expect(sut.formName).toEqual(params.formName);
  });

  [ { autoname: null, expected: false },
    { autoname: undefined, expected: false },
    { autoname: '', expected: false },
    { autoname: 'a', expected: true },
  ].forEach(rec => {
    it('updates the view model from the state on activate', () => {
      const currMember = { id: 'a' };
      const form = { id: 'b', autoname: rec.autoname };
      const state = {};

      storeSpy.getState.and.returnValue(state);
      getFormSpy.and.returnValue(form);
      getCurrentMemberSpy.and.returnValue(currMember);

      sut.activate({});

      expect(getFormSpy).toHaveBeenCalledWith(state);
      expect(getCurrentMemberSpy).toHaveBeenCalledWith(state);
      expect(sut.model.formId).toEqual('b');
      expect(sut.hasAutoName).toEqual(rec.expected);
      expect(sut.model.memberId).toEqual('a');
    });
  });

  it('dispatches an event to create the new form', () => {
    sut.model.memberId = 'a';
    sut.model.formId = 1;

    sut.create();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(createFormData({
      formId: 1, memberId: 'a'
    }));
  });

  it('navigates back to the form data list after creating a new one', () => {
    sut.memberId = 'a';
    sut.formName = 'b';

    sut.create();

    expect(routerSpy.navigateToRoute).toHaveBeenCalledWith('data', {
      memberId: 'a', formName: 'b'
    });
  });
});
