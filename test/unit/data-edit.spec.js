import { Store } from 'aurelia-redux-plugin';
import { DataEdit } from '../../src/data-edit';
import { setupSpy } from './jasmine-helpers';
import { requestTemplate } from '../../src/domain/index';
import * as selectors from '../../src/domain/template/selectors';

describe('edit data view model', () => {
  let storeSpy;
  let sut;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);

    sut = new DataEdit(storeSpy);

  });

  it('initialized default properties', () => {
    expect(sut.html).toEqual('');
  });

  it('dispatches the request action after subscribing', () => {
    const params = { form: 1 };

    storeSpy.subscribe.and.callFake(arg => {
      expect(storeSpy.dispatch).not.toHaveBeenCalled();
    });

    sut.activate(params);

    expect(storeSpy.subscribe).toHaveBeenCalled();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestTemplate(params.form));
  });

  [ { template: null, expect: '' },
    { template: undefined, expect: '' },
    { template: { html: 'a' }, expect: 'a' }
  ].forEach(data => {
    it('sets the view model html to the template if exists on subscribe', () => {
      const params = { form: 1 };
      const state = {};
      const getTemplateSpy = spyOn(selectors, 'getTemplate').and
        .returnValue(data.template);
      let updateFunc = null;

      storeSpy.getState.and.returnValue(state);

      storeSpy.subscribe.and.callFake(func => updateFunc = func);

      sut.activate(params);
      updateFunc();

      expect(getTemplateSpy.calls.count()).toEqual(1);
      expect(getTemplateSpy.calls.argsFor(0)[0]).toBe(state);
      expect(sut.html).toEqual(data.expect);
    });
  });

  it('gets the template on every store subscribe call', () => {
    const params = { form: 1 };
    const getTemplateSpy = spyOn(selectors, 'getTemplate');
    let updateFunc = null;

    storeSpy.subscribe.and.callFake(func => updateFunc = func);

    sut.activate(params);
    updateFunc();
    updateFunc();

    expect(getTemplateSpy.calls.count()).toEqual(2);
  });
})
