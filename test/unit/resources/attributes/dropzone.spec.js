import $ from 'jquery';
import * as Interact from 'interact.js';
import { InteractStub } from '../../stubs';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import using from 'jasmine-data-provider';

describe('the dropzone custom attribute', () => {
  let sut;
  let interactStub;
  let classListSpy;
  let appendChildSpy;
  let eventStub;

  beforeEach(() => {
    const interactFunc = jasmine.createSpy('interactFunc');
    interactStub = new InteractStub();
    interactFunc.and.returnValue(interactStub);

    classListSpy = jasmine.createSpyObj('classList', ['add', 'remove']);
    appendChildSpy = jasmine.createSpy('appendChild');
    eventStub = {
      target: {
        classList: classListSpy,
        appendChild: appendChildSpy
      }
    };

    sut = StageComponent.withResources('resources/attributes/dropzone');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(Interact, interactFunc);
    };

    sut.inView(`<div dropzone></div>`);
  });

  afterEach(() => sut.dispose());

  it('configures the drop zone options', async done => {
    await sut.create(bootstrap);
    const config = interactStub.options.dropzone;

    expect(config).toBeDefined();
    expect(sut.element.classList).toContain('dropzone');
    done();
  });

  it('adds drop-target class on ondragenter', async done => {
    await sut.create(bootstrap);

    const config = interactStub.options.dropzone;
    config.ondragenter(eventStub);

    expect(classListSpy.add).toHaveBeenCalledWith('drop-target');
    done();
  });

  it('appends the droppable to the closest draggable parents parent', async done => {
    const grandParent = document.createElement('div');
    const parent = document.createElement('div');
    const child = document.createElement('div');
    child.style.webkitTransform = child.style.transform = 'translate(1px,1px)';
    child.setAttribute('data-x', '1');
    child.setAttribute('data-y', '2');
    parent.classList.add('drop-target');
    parent.setAttribute('data-x', '3');
    parent.setAttribute('data-y', '4');
    parent.appendChild(child);
    grandParent.appendChild(parent);

    eventStub.target = parent;
    eventStub.relatedTarget = child;

    await sut.create(bootstrap);

    const config = interactStub.options.dropzone;
    config.ondragleave(eventStub);

    expect(child.style.webkitTransform).toEqual('');
    expect(child.style.transform).toEqual('');
    expect(parent.children.length).toEqual(0);
    expect(grandParent.children.length).toEqual(2);
    expect(child.getAttribute('data-x')).toEqual('4');
    expect(child.getAttribute('data-y')).toEqual('6');
    expect(parent.classList).not.toContain('drop-target');
    done();
  });

  it('adds drop-active class ondropactivate', async done => {
    await sut.create(bootstrap);

    const config = interactStub.options.dropzone;
    config.ondropactivate(eventStub);

    expect(classListSpy.add).toHaveBeenCalledWith('drop-active');
    done();
  });

  it('removes drop classes on dropdeactivate', async done => {
    await sut.create(bootstrap);

    const config = interactStub.options.dropzone;
    config.ondropdeactivate(eventStub);

    expect(classListSpy.remove.calls.argsFor(0)[0]).toEqual('drop-active');
    expect(classListSpy.remove.calls.argsFor(1)[0]).toEqual('drop-target');
    done();
  });

  it('appends the child ondrop when not a parent of the target', async done => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    child.style.webkitTransform = child.style.transform = 'translate(1px,1px)';
    child.setAttribute('data-x', '1');
    child.setAttribute('data-y', '2');

    eventStub.target = parent;
    eventStub.relatedTarget = child;

    await sut.create(bootstrap);

    const config = interactStub.options.dropzone;
    config.ondrop(eventStub);

    expect(parent.children[0]).toBe(child);
    expect(child.style.webkitTransform).toEqual('');
    expect(child.style.transform).toEqual('');
    expect(child.getAttribute('data-x')).toEqual('0');
    expect(child.getAttribute('data-y')).toEqual('0');
    done();
  });

  it('does not append the child ondrop when not is parent of the target', async done => {
    eventStub.relatedTarget = {};
    spyOn($.fn, 'find').and.returnValue([1]);

    await sut.create(bootstrap);

    const config = interactStub.options.dropzone;
    config.ondrop(eventStub);

    expect(appendChildSpy).not.toHaveBeenCalled();
    done();
  });

  it('does nothing when already child', async done => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    child.style.webkitTransform = child.style.transform = 'translate(1px,1px)';
    child.setAttribute('data-x', '1');
    child.setAttribute('data-y', '2');

    parent.appendChild(child);

    eventStub.target = parent;
    eventStub.relatedTarget = child;

    await sut.create(bootstrap);

    const config = interactStub.options.dropzone;
    config.ondrop(eventStub);

    expect(child.style.webkitTransform).toEqual('translate(1px, 1px)');
    expect(child.style.transform).toEqual('translate(1px, 1px)');
    expect(child.getAttribute('data-x')).toEqual('1');
    expect(child.getAttribute('data-y')).toEqual('2');
    done();
  });
});
