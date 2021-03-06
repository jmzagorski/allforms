import { FormServiceProvider } from '../../../../src/elements/services/form-service-provider';
import { FormService} from '../../../../src/elements/services/form-service';
import { ExcelEngine } from '../../../../src/functions/excel/engine';
import { HttpStub } from '../../stubs';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import { NewInstance } from 'aurelia-framework';
import { setupSpy } from '../../jasmine-helpers';

describe('the auto save form attribute', () => {
  let sut;
  let httpStub;
  let xlSpy;
  let formProviderSpy;
  let formServiceSpy;

  beforeEach(() => {
    httpStub = new HttpStub();
    xlSpy = setupSpy('xl', ExcelEngine.prototype);
    formServiceSpy = setupSpy('formService', FormService.prototype);
    formProviderSpy = setupSpy('formProviderService', FormServiceProvider.prototype);
    formProviderSpy.provide.and.returnValue(formServiceSpy)
    // kind of weird but for some reason my httpStub does not get called if it is
    // returned from NewInstance.of. An HttpStub is used in teh test, but not
    // this instance. However the spy gets used
    let fetchSpy = jasmine.createSpy('fetch');

    fetchSpy.and.callFake((api, blob) => {
      return httpStub.fetch(api, blob)
    });

    sut = StageComponent.withResources('resources/elements/autosave-form');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(ExcelEngine, xlSpy);
      aurelia.container.registerInstance(FormServiceProvider, formProviderSpy);
    };

    spyOn(NewInstance, 'of').and.returnValue({
      fetch: fetchSpy
    });
  });

  afterEach(() => {
    if (sut.element) sut.dispose();
  });

  it('does nothing when no form is found', async done => {
    sut.inView('<div autosave-form></div>');

    await sut.create(bootstrap);

    expect(formServiceSpy.populate).not.toHaveBeenCalled();
    done();
  });

  [ '<form autosave-form.bind="options"></form>',
    '<div><form autosave-form.bind="options"></form></div>'
  ].forEach(html => {
    it('provides the form service with the form', async done => {
      sut.inView(html).boundTo({ options: { } });

      await sut.create(bootstrap);
      const $form = sut.element.parentNode.querySelector('form');

      expect(formProviderSpy.provide).toHaveBeenCalledWith($form);
      done();
    });
  });

  it('calls the form service to populate the form', async done => {
    const data = {};
    const context = { options: { data } };
    sut.inView(`<form autosave-form.bind="options"></form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    expect(formServiceSpy.populate).toHaveBeenCalledWith(data);
    done();
  });

  it('rebinds on options value changing', async done => {
    const context = { options: { dataId: 'a' } };
    sut.inView(`<form autosave-form.bind="options"></form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    context.options = { dataId: 'b' };

    setTimeout(() => {
      expect(formServiceSpy.populate.calls.count()).toEqual(2);
      done();
    })
  });

  it('prevents submission of form', async done => {
    const context = { autoSaveOpts: { method: 'a', dataId: 'b' } };
    const preventDefaultSpy = jasmine.createSpy('preventDefault');
    const event = { preventDefault: preventDefaultSpy }

    sut.inView(`<form autosave-form.bind="autoSaveOpts"></form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    sut.element.onsubmit(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    done();
  });

  it('calls the form service to collect and emit the data', async done => {
    let event = null
    const collect = e => event = e;
    const options = { dataId: 'a' }
    const data = {};
    sut.inView(`<form action="testUrl" dataready.delegate="collect($event)"
      autosave-form.bind="options"></form>`).boundTo({ collect, options });

    formServiceSpy.collect.and.returnValue(data);

    await sut.create(bootstrap);

    await sut.element.onchange();

    expect(event).not.toEqual(null);
    expect(event.detail).not.toEqual(null);
    expect(event.detail.data).toBe(data);
    expect(event.detail.api).toContain('testUrl');
    done();
  });
});
