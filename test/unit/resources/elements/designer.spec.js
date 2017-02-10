import '../../setup';
import * as Interact from 'interact.js';
import { InteractStub, ElementStub } from '../../stubs';
import { TemplatingEngine } from 'aurelia-framework';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import { DOM } from 'aurelia-pal';
import * as renderers from '../../../../src/renderers/bootstrap';

describe('the designer custom element', () => {
  let sut;
  let templatingSpy;
  let context;
  // since i throw an error in the bind method, TODO is that a good idea?
  let dispose = true;
  let realElement;

  beforeEach(() => {
    //templatingSpy = jasmine.setupSpy('templating', TemplatingEngine.prototype);
    // FIXME: i cannot figure out a way to mock the attributes so mock the
    // interactable dependency so we get less potential side affects
    const interactFunc = jasmine.createSpy('interactFunc');
    const interactSpy = jasmine.setupSpy('interact', InteractStub.prototype);
    interactFunc.and.returnValue(interactSpy);

    sut = StageComponent.withResources('resources/elements/designer');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(Interact, interactFunc);
      //aurelia.container.registerInstance(TemplatingEngine, templatingSpy);
    };

    context = { formstyle: 'bootstrap' };

    realElement = document.createElement('div');
    document.body.appendChild(realElement);
    spyOn(renderers, 'date').and.returnValue(realElement);
  });

  afterEach(() => {
    if (dispose) sut.dispose();
    realElement.parentNode.removeChild(realElement);
    realElement = null;
  });

  it('throws when the render is not found for the form style', async done => {
    context.formstyle = 'aaa';
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);

    await sut.create(bootstrap).catch(err => {
      expect(err).toEqual(new Error('Formstyle not found for aaa'));
      dispose = false;
      done();
    });
  });

  it('throws when the element renderer is not found', async done => {
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);

    const ex = () => sut.viewModel.createElement({ type: 'a' });

    expect(ex).toThrow(new Error('Renderer not found for a'));
    done();
  });

  it('loops until it finds a valid element id', async done => {
    const domSpy = spyOn(DOM, 'getElementById');
    domSpy.and.returnValues(1, undefined);
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);

    sut.viewModel.createElement({ type: 'date' });

    expect(domSpy.calls.count()).toEqual(2);
    done();
  });

  it('sets the draggable element properties', async done => {
    spyOn(DOM, 'getElementById').and.returnValue(undefined);
    sut.inView(`<designer formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);

    const actual = sut.viewModel.createElement({ type: 'date' });

    expect(actual.id).toBeGreaterThan(0);
    expect(actual.ondblclick).not.toEqual(null);
    expect(actual.getAttribute('draggable')).toEqual('#page-host');
    expect(actual.getAttribute('draggable-dragdone.delegate'))
      .toEqual('setDraggablePosition($event)');
    done();
  });

  it('dispatches an event on element double click', async done => {
    let event = null;
    context.editListener = e => event = e;
    spyOn(DOM, 'getElementById').and.returnValue(undefined);
    sut.inView(`<designer onedit.delegate="editListener($event)" formstyle.bind="formstyle"></designer>`)
      .boundTo(context);
    await sut.create(bootstrap);
    const actual = sut.viewModel.createElement({ type: 'date' });

    actual.ondblclick();

    expect(event).not.toEqual(null);
    expect(event.bubbles).toBeTruthy();
    expect(event.detail).toBeDefined();
    expect(event.detail).toEqual({
      model: { id: actual.id }
    })
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
    })

    const actual = sut.viewModel.createElement({ type: 'date' });

    expect(enhanced).not.toEqual(null);
    expect(enhanced.element).toEqual(actual);
    expect(enhanced.bindingContext).toEqual(sut.viewModel);
    expect(enhanced.resources).toEqual(resources);
    done();
  });
});
