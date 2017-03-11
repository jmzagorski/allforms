import * as Interact from 'interact.js';
import * as renderFactory from '../../../../src/renderers/factory';
import * as utils from '../../../../src/utils';
import { InteractStub, ElementStub } from '../../stubs';
import { TemplatingEngine } from 'aurelia-framework';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { DOM } from 'aurelia-pal';

describe('the designer custom element', () => {
  let sut;
  let context;
  // since i throw an error in the bind method, TODO is that a good idea?
  let dispose;
  let realElement;
  let setDefaultSpy;
  let renderSpy;

  beforeEach(() => {
    // FIXME: i cannot figure out a way to mock the attributes so mock the
    // interactable dependency so we get less potential side affects
    const interactFunc = jasmine.createSpy('interactFunc');
    const interactSpy = new InteractStub();
    interactFunc.and.returnValue(interactSpy);

    sut = StageComponent.withResources('resources/elements/designer');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(Interact, interactFunc);
    };

    context = { formstyle: 'bootstrap' };
    dispose = true;

    realElement = document.createElement('div');
    document.body.appendChild(realElement);
    renderSpy = spyOn(renderFactory, 'create');
    renderSpy.and.returnValue(realElement);
    setDefaultSpy = spyOn(utils, 'setDefaultVal');
  });

  afterEach(() => {
    if (dispose) sut.dispose();
    realElement.parentNode.removeChild(realElement);
    realElement = null;
  });

  using([
    { template: '', html: '<form id="a"></form>' },
    { template: '<form></form>', html: '<form id="a"></form>' },
    { template: '<div></div>', html: '<form id="a"><div></div></form>' }
  ], data => {
    it('always has a form element', async done => {
      context.template = data.template;
      context.formid = 'a';
      sut.inView(`<designer formid.bind="formid" innerhtml.bind="template" formstyle.bind="formstyle"></designer>`)
        .boundTo(context);

      await sut.create(bootstrap);

      setTimeout(() => {
        const forms = sut.element.querySelectorAll('form');
        const form = forms[0];

        expect(forms.length).toEqual(1);
        expect(form).toBeDefined();
        expect(form.id).toEqual('a');
        expect(sut.element.innerHTML).toEqual(data.html);
        done();
      });
    });
  });

  it('enhances existing children on attached', async done => {
    context.html = '<form><div id="dummy"></div></form>'
    sut.inView(`<designer innerhtml.bind="html" formstyle.bind="formstyle"></designer>`)
      .boundTo(context);

    const enhanceSpy = spyOn(TemplatingEngine.prototype, 'enhance').and.callThrough();

    await sut.create(bootstrap);
    const child = document.querySelector('#dummy');
    const call = enhanceSpy.calls.mostRecent().args[0];

    // 2 because aurelia-testing must call it and 1 for my one div in the form
    expect(enhanceSpy.calls.count()).toEqual(2);
    expect(call.element).toBe(child);
    expect(call.bindingContext).toBe(sut.viewModel);
    // TODO - this is a private variable but i dont know how to make the test
    // work any other way
    expect(call.resources).toBe(sut.viewModel._view.resources);
    expect(child.ondblclick).not.toEqual(null);
    expect(child.onchange).not.toEqual(null);
    done();
  });

  it('sets the interact element properties', async done => {
    spyOn(DOM, 'getElementById').and.returnValue(undefined);
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);

    const actual = sut.viewModel.createElement({ id: 1, elementType: 'date' });

    expect(actual.ondblclick).not.toEqual(null);
    expect(actual.getAttribute('draggable.bind')).toEqual('dragOptions');
    expect(actual.getAttribute('resizable.bind')).toEqual('resize');
    expect(actual.getAttribute('data-element-type')).toEqual('date');
    expect(sut.element.querySelector('form').children[0]).toBe(actual);
    done();
  });

  it('returns the existing dom element', async done => {
    const $existing = {};
    const $created = {};
    const model = { id: 1, elementType: 'a' };

    renderSpy.and.returnValue($created);
    spyOn(DOM, 'getElementById').and.returnValue($existing);
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);

    const $actual = sut.viewModel.createElement(model);

    expect(renderSpy.calls.count()).toEqual(1);
    expect(renderSpy).toHaveBeenCalledWith(context.formstyle, 'a', model, $existing);
    // check exact equality
    expect(renderSpy.calls.argsFor(0)[3]).toBe($existing);
    expect($actual).toBe($created);
    done();
  });

  it('enhances the element with the template engine', async done => {
    let enhanced = null;
    const resources = {};
    spyOn(DOM, 'getElementById').and.returnValue(undefined);
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);

    await sut.create(bootstrap);

    // i am not sure if i can intercept the thisView param in the create method
    // so call the actual method on the view model to set the private variable
    sut.viewModel.created(null, { resources });

    spyOn(TemplatingEngine.prototype, 'enhance').and.callThrough().and.callFake(obj => {
      enhanced = obj;
    });

    const actual = sut.viewModel.createElement({ elementType: 'date' });

    expect(enhanced).not.toEqual(null);
    expect(enhanced.element).toEqual(actual);
    expect(enhanced.bindingContext).toEqual(sut.viewModel);
    expect(enhanced.resources).toEqual(resources);
    done();
  });

  it('dispatches an edit event on element double click', async done => {
    let event = null;
    context.editListener = e => event = e;
    spyOn(DOM, 'getElementById').and.returnValue(undefined);
    sut.inView(`<designer onedit.delegate="editListener($event)" formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);
    const actual = sut.viewModel.createElement({ id: 1, elementType: 'date' });

    actual.ondblclick();

    expect(event).not.toEqual(null);
    expect(event.bubbles).toBeTruthy();
    expect(event.detail).toBeDefined();
    expect(event.detail).toEqual({
      model: { type: 'date', id: actual.id }
    })
    done();
  });

  it('sets the default value on change', async done => {
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);
    const actual = sut.viewModel.createElement({ elementType: 'date' });

    actual.onchange({ target: actual });

    expect(setDefaultSpy).toHaveBeenCalledWith(actual);
    done();
  });
});
