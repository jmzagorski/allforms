import { TemplateApi } from '../../../../src/api/template-api';
import { TemplateActions } from '../../../../src/domain/index';
import { Store } from 'aurelia-redux-plugin';

describe('the template actions', () => {
  var sut;
  var storeSpy;
  var apiSpy;

  beforeEach(() => {
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    apiSpy = jasmine.setupSpy('api', TemplateApi.prototype);
    sut = new TemplateActions(apiSpy, storeSpy);
  });

  it('loads the template from the form name', async done => {
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
});
