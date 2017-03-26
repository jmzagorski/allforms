import '../../setup';
import * as Interact from 'interact.js';
import * as utils from '../../../../src/utils';
import { InteractStub, ElementStub } from '../../stubs';
import { TemplatingEngine } from 'aurelia-framework';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import { DOM } from 'aurelia-pal';

describe('the designer custom element', () => {
  let sut;
  let context;
  // since i throw an error in the bind method, TODO is that a good idea?
  let dispose;
  let realElements;
  let setDefaultSpy;

  beforeEach(() => {
    // FIXME: i cannot figure out a way to mock the attributes so mock the
    // interactable dependency so we get less potential side affects
    const interactFunc = jasmine.createSpy('interactFunc');
    const interactSpy = new InteractStub();
    realElements = [];
    interactFunc.and.returnValue(interactSpy);

    sut = StageComponent.withResources('resources/elements/designer');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(Interact, interactFunc);
    };

    context = { formstyle: 'bootstrap' };
    dispose = true;

    setDefaultSpy = spyOn(utils, 'setDefaultVal');
  });

  afterEach(() => {
    if (dispose) sut.dispose();
    if (realElements.length) {
      for (let e of realElements) {
        if (document.getElementById(e.id)) e.parentNode.removeChild(e);
      }
    }
  });

  using([
    { template: '', html: '<form method="post" action="#" id="a"></form>' },
    { template: '<form></form>', html: '<form method="post" action="#" id="a"></form>' },
    { template: '<div></div>', html: '<form method="post" action="#" id="a"><div></div></form>' }
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
    realElements.push(document.createElement('div'));
    const model = {
      id: 1,
      type: 'date',
      create: () => realElements[0]
    };
    spyOn(DOM, 'getElementById').and.returnValue(undefined);
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);

    const actual = sut.viewModel.createElement(model);

    expect(actual).toBe(realElements[0])
    expect(actual.id).toEqual('1');
    expect(actual.ondblclick).not.toEqual(null);
    expect(actual.getAttribute('draggable.bind')).toEqual('dragOptions');
    expect(actual.getAttribute('resizable.bind')).toEqual('resize');
    expect(actual.getAttribute('data-element-type')).toEqual('date');
    expect(sut.element.querySelector('form').children[0]).toBe(actual);
    done();
  });

  it('sets the tab index so the delete key works', async done => {
    realElements.push(document.createElement('div'));
    realElements.push(document.createElement('div'));
    const createSpy = jasmine.createSpy('create');
    createSpy.and.returnValues(realElements[0], realElements[1]);
    const model = {
      id: 1,
      type: 'date',
      create: createSpy
    };
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);

    const actualFirst = sut.viewModel.createElement(model);
    model.id++; // or else the view model will grab the existing element;
    const actualSecond = sut.viewModel.createElement(model);

    expect(actualFirst.tabIndex).toEqual(1);
    expect(actualSecond.tabIndex).toEqual(2);
    done();
  });

  [ 'create', 'mutate' ].forEach(method => {
    it('returns the existing dom element', async done => {
      const model = {
        id: 1,
        type: 'a'
      };
      const $existing = {};
      const $created = {};
      const mutateSpy = jasmine.createSpy('mutate');

      realElements.push(document.createElement('div'));
      realElements[0].id = model.id;
      document.body.appendChild(realElements[0]);

      model[method] = mutateSpy
      mutateSpy.and.returnValue(realElements[0]);

      sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
        .boundTo(context);

      await sut.create(bootstrap);

      const $actual = sut.viewModel.createElement(model);

      expect(mutateSpy.calls.argsFor(0)[0]).toBe(realElements[0]);
      expect($actual).toBe(realElements[0]);
      done();
    });
  });

  it('enhances the element with the template engine', async done => {
    realElements.push(document.createElement('div'));
    const model = {
      type: 'date',
      create: () => realElements[0]
    };
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

    const actual = sut.viewModel.createElement(model);

    expect(enhanced).not.toEqual(null);
    expect(enhanced.element).toEqual(actual);
    expect(enhanced.bindingContext).toEqual(sut.viewModel);
    expect(enhanced.resources).toEqual(resources);
    done();
  });

  it('dispatches an edit event on element double click', async done => {
    realElements.push(document.createElement('div'));
    const model = {
      type: 'date',
      create: () => realElements[0],
      id: 1
    };
    let event = null;
    context.editListener = e => event = e;
    spyOn(DOM, 'getElementById').and.returnValue(undefined);
    sut.inView(`<designer onedit.delegate="editListener($event)" formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);
    const actual = sut.viewModel.createElement(model);

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
    realElements.push(document.createElement('div'));
    const model = {
      type: 'date',
      create: () => realElements[0]
    };
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);
    const actual = sut.viewModel.createElement(model);

    actual.onchange({ target: actual });

    expect(setDefaultSpy).toHaveBeenCalledWith(actual);
    done();
  });

  [ { code: 8, removed: true },
    { code: 46, removed: true },
    { code: 47, removed: false }
  ].forEach(data => {
    it('decides if should remove the element on delete or backspace key', async done => {
      const elem = document.createElement('div')
      const model = {
        type: 'date',
        create: () => elem,
        id: 1
      };
      const keyEvent = { target: elem, keyCode: data.code };

      realElements.push(elem);
      sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
        .boundTo(context);
      await sut.create(bootstrap);

      const actual = sut.viewModel.createElement(model);

      actual.onkeydown(keyEvent);

      expect(!document.getElementById(model.id)).toEqual(data.removed);
      done();
    });
  });

  // to fix a bug where nested elements were being deleted
  it('does not remove the element if there is not data type attribute', async done => {
    realElements.push(document.createElement('div'));
    const model = {
      type: 'date',
      create: () => realElements[0],
      id: 1
    };
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);

    const actual = sut.viewModel.createElement(model);

    actual.removeAttribute('data-element-type')
    actual.onkeydown({ target: actual });

    expect(document.getElementById(model.id)).not.toEqual(null);
    done();
  });
});
