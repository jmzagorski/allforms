import * as Interact from 'interact.js';
import * as domServices from '../../../../src/elements/services/dom-service';
import { InteractStub } from '../../stubs';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';

describe('the interact form custom element', () => {
  let sut;

  beforeEach(() => {
    // FIXME: how can i get rid of these mocks. the interact form requires these
    // in the html and all tests will throw if not setup to spy
    const interactFunc = jasmine.createSpy('interactFunc');
    const interactSpy = new InteractStub();
    interactFunc.and.returnValue(interactSpy);

    sut = StageComponent.withResources('resources/elements/interact-form');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(Interact, interactFunc);
    };
  });

  afterEach(() => sut.dispose());

  it('binds to the form element', async done => {
    const context = { id: 1, action: 'act' };

    sut.inView(`<interact-form id.bind="id" action.bind="action"></interact-form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    const form = sut.element.querySelector('form');

    expect(form).not.toEqual(null);
    expect(form.getAttribute('enhance-html.one-way')).toEqual('interactHtml');
    expect(form.id).toEqual('1');
    expect(form.method).toEqual('post');
    expect(form.action).toContain('/act');
    done();
  });

  it('add multipart formdata when a file is on the form', async done => {
    const context = { id: 1, action: 'act', html: '<input type="text">' };

    sut.inView(`<interact-form html.bind="html" id.bind="id" action.bind="action"></interact-form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    const form = sut.element.querySelector('form');
    expect(form.enctype).toEqual('application/x-www-form-urlencoded');

    context.html = '<input type="file">';

    setTimeout(() => {
      expect(form.enctype).toEqual('multipart/form-data');
      done();
    });
  });

  it('makes all form children interactable', async done => {
    const context = { html: '<div></div><a></a>'};

    sut.inView(`<interact-form html.bind="html"></interact-form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    const $div = sut.element.querySelector('div');
    const $link = sut.element.querySelector('a');

    expect($div.getAttribute('draggable.bind')).toEqual('interactOptions.dragOptions');
    expect($div.getAttribute('resizable.bind')).toEqual('interactOptions.resize');
    expect($div.tabIndex).toEqual(1);
    expect($link.getAttribute('draggable.bind')).toEqual('interactOptions.dragOptions');
    expect($link.getAttribute('resizable.bind')).toEqual('interactOptions.resize');
    expect($link.tabIndex).toEqual(2);
    done();
  });

  [ null, undefined, {}, { dragOptions: { enabled: true } }].forEach(interactOptions => {
    it('add drag option defaults if none are passed', async done => {
      let event = null;
      const context = { interactOptions, html: '<input id="2">', listener: e => event = e };

      sut.inView(`<interact-form html.bind="html"
      oninteract.delegate="listener($event)"></interact-form>`).boundTo(context);

      await sut.create(bootstrap);
      const $form = sut.element.querySelector('form');
      const $input = sut.element.querySelector('input');

      const onendEvent = { target:  $input };
      sut.viewModel.interactOptions.dragOptions.onend(onendEvent);

      expect(event).not.toEqual(null);
      expect(event.detail).not.toEqual(null);
      expect(event.bubbles).toBeTruthy();
      expect(event.detail.type).toEqual('move');
      expect(event.detail.$form).toBe($form);
      expect(event.detail.$elem).toBe($input);
      done();
    });
  });

  it('sets default value on change', async done => {
    let event = null;
    const context = { html: '<input id="1">', listener: e => event = e };
    const setDefaultSpy = spyOn(domServices, 'setDefaultVal');

    sut.inView(`<interact-form html.bind="html"
      oninteract.delegate="listener($event)"></interact-form>`).boundTo(context);

    await sut.create(bootstrap);

    const $input = sut.element.querySelector('input');
    const $form = sut.element.querySelector('form');
    $input.onchange({ target: $input });

    expect(event).not.toEqual(null);
    expect(event.detail).not.toEqual(null);
    expect(event.detail.type).toEqual('valset');
    expect(event.detail.$elem).toBe($input);
    expect(event.detail.$form).toBe($form);
    expect(setDefaultSpy).toHaveBeenCalledWith($input);
    done();
  });

  // TODO how to test that the interactable was deleted and not the element
  // that bubbled the event
  it('removes the element on delete', async done => {
    let event = null;
    const context = { html: '<input id="1">', listener: e => event = e };
    const deleteSpy = spyOn(domServices, 'deleteTarget').and.returnValue(true);

    sut.inView(`<interact-form oninteract.delegate="listener($event)" html.bind="html"></interact-form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    const $input = sut.element.querySelector('input');
    const $form = sut.element.querySelector('form');
    const keyEvent = { target: $input, keyCode: 46 };

    $input.onkeydown(keyEvent);

    expect(deleteSpy).toHaveBeenCalledWith({
      keyCode: 46,
      target: $input
    });
    expect(deleteSpy.calls.argsFor(0)[0].target).toBe($input);
    expect(deleteSpy.calls.count()).toEqual(1);
    expect(event).not.toEqual(null);
    expect(event.detail).not.toEqual(null);
    expect(event.bubbles).toBeTruthy();
    expect(event.detail.type).toEqual('delete');
    expect(event.detail.$elem).toBe($input);
    expect(event.detail.$form).toBe($form);
    done();
  });

  it('does not remove the element when delete fails', async done => {
    let event = null;
    const context = { html: '<input id="1">', listener: e => event = e };
    const deleteSpy = spyOn(domServices, 'deleteTarget').and.returnValue(false);

    sut.inView(`<interact-form oninteract.delegate="listener($event)" html.bind="html"></interact-form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    const $input = sut.element.querySelector('input');
    $input.onkeydown({ keyCode: 47 });

    expect(event).toEqual(null);
    done();
  });

  it('prevents default on the element on click', async done => {
    const context = { html: '<input id="1">'  };
    const event = {
      preventDefault: jasmine.createSpy('prevent')
    };

    sut.inView(`<interact-form html.bind="html"></interact-form>`)
      .boundTo(context);

    await sut.create(bootstrap);

    const $input = sut.element.querySelector('input');
    $input.onclick(event);

    expect(event.preventDefault.calls.count()).toEqual(1);
    done();
  });

  it('dispatches interact event on element double click', async done => {
    let event = null
    const context = { html: '<input id="1">', listener: $event => event = $event };

    sut.inView(`<interact-form html.bind="html"
      oninteract.delegate="listener($event)"></interact-form>`).boundTo(context);

    await sut.create(bootstrap);

    const $input = sut.element.querySelector('input');
    const $form = sut.element.querySelector('form');
    $input.ondblclick();

    expect(event).not.toEqual(null);
    expect(event.detail).not.toEqual(null);
    expect(event.bubbles).toBeTruthy();
    expect(event.detail.type).toEqual('dblclick');
    expect(event.detail.$elem).toBe($input);
    expect(event.detail.$form).toBe($form);
    done();
  });
});
