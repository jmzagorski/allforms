import { HttpStub } from '../../stubs';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import { NewInstance } from 'aurelia-framework';

describe('the auto save form attribute', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    // kind of hacky but for some reason my httpStub does not get called if it is
    // returned from NewInstance.of. An HttpStub is used in teh test, but not
    // this instance. However the spy gets used
    let fetchSpy = jasmine.createSpy('fetch');

    fetchSpy.and.callFake((api, blob) => {
      return httpStub.fetch(api, blob)
    });

    sut = StageComponent.withResources('resources/elements/autosave-form');

    spyOn(NewInstance, 'of').and.returnValue({
      fetch: fetchSpy
    });
  });

  afterEach(() => {
    if (sut.element) sut.dispose();
  });

  [ { }, { api: 'a' }, { action: 'p'} ].forEach(options => {
    it('throws when no value options exists', async done => {
      sut.inView(`<form autosave-form.bind="options"></form>`)
        .boundTo({ options });

      await sut.create(bootstrap);

      const ex = () => sut.element.onchange();

      expect(ex).toThrow(new Error('the binding object must have an action and api property'));
      done();
    });
  });

  it('prevents submission of form', async done => {
    const context = { autoSaveOpts: { action: 'a', api: 'b' } };
    const preventDefaultSpy = jasmine.createSpy('preventDefault');
    const event = { preventDefault: preventDefaultSpy }

    sut.inView(`<form autosave-form.bind="autoSaveOpts"></form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    sut.element.onsubmit(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    done();
  });

  it('sends the form element values on form change', async done => {
    const context = { autoSaveOpts: { action: 'a', api: 'b' } };
    const fr = new FileReader();
    const formValues = { data: { d: 'c', f: 'e' } };
    fr.addEventListener('loadend', () => {
      expect(fr.result).toEqual(JSON.stringify(formValues));
      done();
    });

    sut.inView(`<form autosave-form.bind="autoSaveOpts">
      <input value="c" name="d"><input value="e" name="f">
    </form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    sut.element.onchange();

    expect(httpStub.url).toEqual('b');
    expect(httpStub.blob.method).toEqual('a');
    fr.readAsText(httpStub.blob.body);
  });
});
