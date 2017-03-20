import { Store } from 'aurelia-redux-plugin';
import { DataEdit } from '../../src/data-edit';
import { setupSpy } from './jasmine-helpers';
import {
  TemplateActions,
  getTemplate
} from '../../src/domain/index';
import * as selectors from '../../src/domain/template/template-selectors';

describe('edit data view model', () => {
  let storeSpy;
  let actionSpy;
  let getTemplateSpy;
  let sut;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    actionSpy = setupSpy('actionSpy', TemplateActions.prototype);

    sut = new DataEdit(storeSpy, actionSpy);

    getTemplateSpy = spyOn(selectors, 'getTemplate').and.returnValue({});
  });

  it('initialized default properties', () => {
    expect(sut.html).toEqual('');
  });

  it('loads the template before selecting it from the state', async done => {
    const params = { form: 1 };

    actionSpy.loadTemplateFor.and.callFake(arg => {
      expect(getTemplateSpy).not.toHaveBeenCalled();
      expect(arg).toEqual(params.form);
    });

    await sut.activate(params);

    expect(actionSpy.loadTemplateFor).toHaveBeenCalled();
    done();
  });

  [ { template: { }, expect: '' },
    { template: { html: 'a' }, expect: 'a' }
  ].forEach(data => {
    it('sets the view model html to the template if exists', async done => {
      const params = { form: 1 };
      const state = {};

      storeSpy.getState.and.returnValue(state);
      getTemplateSpy.and.returnValue(data.template);

      await sut.activate(params);

      expect(getTemplateSpy.calls.argsFor(0)[0]).toBe(state);
      expect(sut.html).toEqual(data.expect);
      done();
    });
  });
})
