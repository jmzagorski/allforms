import $ from 'jquery';
import * as Interact from 'interact.js';
import { InteractStub } from '../../stubs';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
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

  it('removes drop-target class on ondragleave', async done => {
    await sut.create(bootstrap);

    const config = interactStub.options.dropzone;
    config.ondragleave(eventStub);

    expect(classListSpy.remove).toHaveBeenCalledWith('drop-target');
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
    eventStub.relatedTarget = {};
    spyOn($.fn, 'find').and.returnValue([]);

    await sut.create(bootstrap);

    const config = interactStub.options.dropzone;
    config.ondrop(eventStub);

    expect(appendChildSpy.calls.argsFor(0)[0]).toBe(eventStub.relatedTarget);
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

});
