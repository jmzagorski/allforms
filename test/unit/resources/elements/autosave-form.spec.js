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

  beforeEach(() => {
    httpStub = new HttpStub();
    xlSpy = setupSpy('xl', ExcelEngine.prototype);
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
    };

    spyOn(NewInstance, 'of').and.returnValue({
      fetch: fetchSpy
    });
  });

  afterEach(() => {
    if (sut.element) sut.dispose();
  });

  [ '<form autosave-form.bind="options"></form>',
    '<div><form autosave-form.bind="options"></form></div>'
  ].forEach(html => {
    it('binds to a form or a nested form', async done => {
      const context = { options: { action: 'a', api: 'b' } };
      sut.inView(html).boundTo(context);

      await sut.create(bootstrap);
      const $form = sut.element.parentNode.querySelector('form');

      // do a basic test to make sure something on the form is setup and the
      // method was not short circuited
      expect($form.onchange).not.toEqual(null);
      done();
    });
  });

  it('populates the form on value changed', async done => {
    const context = { autoSaveOpts: { action: 'a', api: 'b', data: { d: 'c', f: 'e' } } };

    sut.inView(`<form autosave-form.bind="autoSaveOpts">
      <input name="d"><input name="f">
    </form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    // test values were set on binding
    expect(sut.element.elements['d'].value).toEqual('c');
    expect(sut.element.elements['f'].value).toEqual('e');

    context.autoSaveOpts = { action: 'a', api: 'b', data: { d: 'g', f: 'h' } };

    // test values were set on change
    setTimeout(() => {
      expect(sut.element.elements['d'].value).toEqual('g');
      expect(sut.element.elements['f'].value).toEqual('h');
      done();
    })
  });

  it('hides empty outputs by default', async done => {
    const context = { autoSaveOpts: { action: 'a', api: 'b' } };

    sut.inView(`<form autosave-form.bind="autoSaveOpts">
      <output></output><output>1</output>
    </form>`).boundTo(context);

    await sut.create(bootstrap);

    const $outputs = sut.element.querySelectorAll('output');

    expect($outputs[0].hidden).toBeTruthy();
    expect($outputs[1].hidden).toBeFalsy();
    done();
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
    const formValues = { data: { d: 'c', f: 'e', g: 'h' } };
    xlSpy.parse.and.returnValue({ result: 'h'});
    fr.addEventListener('loadend', () => {
      expect(fr.result).toEqual(JSON.stringify(formValues));
      done();
    });

    sut.inView(`<form autosave-form.bind="autoSaveOpts">
      <input value="c" name="d"><input value="e" name="f">
      <output data-formula="SUM()" name="g"></output>
    </form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    await sut.element.onchange();

    expect(httpStub.url).toEqual('b');
    expect(httpStub.blob.method).toEqual('a');
    fr.readAsText(httpStub.blob.body);
  });

  it('calculates outputs', async done => {
    const context = { autoSaveOpts: { action: 'a', api: 'b' } };
    xlSpy.parse.and.returnValues({ result: 1 },{ result: 2 },{ result: 0 },
      { result: null }, { result: undefined });

    sut.inView(`<form autosave-form.bind="autoSaveOpts">
      <output name="a" data-formula="SUM(1)"></output>
      <output name="b" data-formula="SUM(2)"></output>
      <output name="c" data-formula="SUM(3)"></output>
      <output name="d" data-formula="SUM(4)"></output>
      <output name="e" data-formula="SUM(5)"></output>
    </form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    const $outputs = sut.element.querySelectorAll('output');

    await sut.element.onchange();

    expect($outputs[0].value).toEqual('1');
    expect($outputs[0].hidden).toBeFalsy()
    expect($outputs[1].value).toEqual('2');
    expect($outputs[1].hidden).toBeFalsy()
    expect($outputs[2].value).toEqual('0');
    expect($outputs[2].hidden).toBeFalsy();
    expect($outputs[3].hidden).toBeTruthy();
    expect($outputs[4].hidden).toBeTruthy();
    done();
  });

  [ { }, { api: 'a' }, { action: 'p'} ].forEach(options => {
    it('throws when no value options exists', async done => {
      sut.inView(`<form autosave-form.bind="options"></form>`)
        .boundTo({ options });

      await sut.create(bootstrap);

      try {
        await sut.element.onchange();
      } catch(e) {
        expect(e).toEqual(new Error('the binding object must have an action and api property'));
        done();
      }
    });
  });
});
