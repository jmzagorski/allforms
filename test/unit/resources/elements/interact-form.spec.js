import * as Interact from 'interact.js';
import * as utils from '../../../../src/utils';
import { InteractStub } from '../../stubs';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';

describe('the interact form custom element', () => {
  let sut;

  beforeEach(() => {
    // FIXME: i cannot figure out a way to mock the attributes so mock the
    // interactable dependency so we get less potential side affects
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
    const setDefaultSpy = spyOn(utils, 'setDefaultVal');

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

  [ { code: 8, removed: true },
    { code: 46, removed: true }
  ].forEach(data => {
    it('removes the element on delete or backspace key', async done => {
      let event = null;
      const context = { html: '<input id="1">', listener: e => event = e };

      sut.inView(`<interact-form oninteract.delegate="listener($event)" html.bind="html"></interact-form>`)
        .boundTo(context);

      await sut.create(bootstrap);

      const $input = sut.element.querySelector('input');
      const $form = sut.element.querySelector('form');
      const keyEvent = { target: $input, keyCode: data.code };

      expect(document.getElementById("1")).toBeTruthy();

      $input.onkeydown(keyEvent);

      expect(event).not.toEqual(null);
      expect(event.detail).not.toEqual(null);
      expect(event.bubbles).toBeTruthy();
      expect(event.detail.type).toEqual('delete');
      expect(event.detail.$elem).toBe($input);
      expect(event.detail.$form).toBe($form);
      expect(!document.getElementById("1")).toEqual(data.removed);
      done();
    });
  });

  it('does not remove the element any other key press', async done => {
    let event = null;
    const context = { html: '<input id="1">', listener: e => event = e };

    sut.inView(`<interact-form oninteract.delegate="listener($event)" html.bind="html"></interact-form>`)
      .boundTo(context);

    await sut.create(bootstrap);
    const $input = sut.element.querySelector('input');

    $input.onkeydown({ keyCode: 47 });

    expect(event).toEqual(null);
    expect(document.getElementById("1")).toBeTruthy();
    done();
  });

  it('prevents default and focuses the element on click', async done => {
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
    expect(document.activeElement).toBe($input);
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
