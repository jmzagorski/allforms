import { TemplateApi } from '../../../../src/api/template-api';
import { TemplateActions } from '../../../../src/domain/index';
import { Store } from 'aurelia-redux-plugin';
import { setupSpy } from '../../jasmine-helpers';
import * as selectors from '../../../../src/domain/template/template-selectors';
import using from 'jasmine-data-provider';

describe('the template actions', () => {
  let sut;
  let storeSpy;
  let apiSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    apiSpy = setupSpy('api', TemplateApi.prototype);

    sut = new TemplateActions(apiSpy, storeSpy);
  });

  it('loads the template from the form id', async done => {
    const template = {};

    apiSpy.get.and.returnValue(template);

    await sut.loadTemplateFor('a');

    expect(apiSpy.get).toHaveBeenCalledWith('a');
    expect(storeSpy.dispatch).toHaveBeenCalledWith({
      type: 'LOAD_TEMPLATE_SUCCESS', template
    });
    expect(storeSpy.dispatch.calls.argsFor(0)[0].template).toBe(template);
    done();
  });

  using([null, undefined, ''], id => {
    it('adds the template if the id is not available', async done => {
      const template = { id };
      const serverTemplate = { };
      const state = {};
      const selectorSpy = spyOn(selectors, 'getTemplate');

      storeSpy.getState.and.returnValue(state);
      apiSpy.add.and.returnValue(serverTemplate);
      selectorSpy.and.returnValue(template);

      await sut.save(template);

      expect(apiSpy.add).toHaveBeenCalledWith(template);
      expect(apiSpy.edit).not.toHaveBeenCalled();
      expect(selectorSpy.calls.argsFor(0)[0]).toBe(state);
      expect(storeSpy.dispatch).toHaveBeenCalledWith({
        type: 'ADD_TEMPLATE_SUCCESS', template: serverTemplate
      });
      expect(storeSpy.dispatch.calls.argsFor(0)[0].template).toBe(serverTemplate);
      done();
    });
  });

  it('edits the template if the id is available', async done => {
    const template = { id: 'a' };
    const serverTemplate = { };
    const state = { };
    const selectorSpy = spyOn(selectors, 'getTemplate');

    storeSpy.getState.and.returnValue(state);
    selectorSpy.and.returnValue(template);
    apiSpy.edit.and.returnValue(serverTemplate);

    await sut.save(template);

    expect(apiSpy.edit).toHaveBeenCalledWith(template);
    expect(apiSpy.add).not.toHaveBeenCalled();
    expect(selectorSpy.calls.argsFor(0)[0]).toBe(state);
    expect(storeSpy.dispatch).toHaveBeenCalledWith({
      type: 'EDIT_TEMPLATE_SUCCESS', template: serverTemplate
    });
    expect(storeSpy.dispatch.calls.argsFor(0)[0].template).toBe(serverTemplate);
    done();
  });
});
