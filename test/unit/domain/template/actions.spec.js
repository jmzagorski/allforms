import { TemplateApi } from '../../../../src/api/template-api';
import { Store } from 'aurelia-redux-plugin';
import { setupSpy } from '../../jasmine-helpers';
import * as selectors from '../../../../src/domain/template/selectors';
import * as actions from '../../../../src/domain/template/actions';
import using from 'jasmine-data-provider';

describe('the template actions', () => {
  let sut;
  let storeSpy;
  let apiSpy;
  let selectorSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    apiSpy = setupSpy('api', TemplateApi.prototype);
    sut = new actions.TemplateActions(apiSpy, storeSpy);

    selectorSpy = spyOn(selectors, 'getTemplate');
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

  it('creates the action to request a template', () => {
    const expected = {
      type: 'REQUEST_TEMPLATE',
      payload: { id: 1 }
    };

    const actual = actions.requestTemplate(1);

    expect(actual).toEqual(expected);
  });

  [ true, false ].forEach(error => {
    it('creates the action for a received template', () => {
      const payload = { id: 1 };
      const expected = {
        type: 'RECEIVED_TEMPLATE',
        payload,
        error
      };

      const actual = actions.receivedTemplate(payload, error);

      expect(actual).toEqual(expected);
    });
  });

  it('creates the action to to create a template', () => {
    const expected = {
      type: 'CREATE_TEMPLATE',
      payload: { id: 1 }
    };

    const actual = actions.createTemplate(expected.payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toEqual(expected.payload);
  });

  it('creates the action to to edit a template', () => {
    const expected = {
      type: 'EDIT_TEMPLATE',
      payload: { id: 1 }
    };

    const actual = actions.editTemplate(expected.payload);

    expect(actual).toEqual(expected);
    expect(actual.payload).toEqual(expected.payload);
  });

  [ true, false ].forEach(error => {
    it('creates the action for a created template', () => {
      const payload = { id: 1 };
      const expected = {
        type: 'TEMPLATE_CREATED',
        payload,
        error
      };

      const actual = actions.templateCreated(payload, error);

      expect(actual).toEqual(expected);
    });
  });

  [ true, false ].forEach(error => {
    it('creates the action for an edited template', () => {
      const payload = { id: 1 };
      const expected = {
        type: 'TEMPLATE_EDITED',
        payload,
        error
      };

      const actual = actions.templateEdited(payload, error);

      expect(actual).toEqual(expected);
    });
  });
});
