import '../../setup';
import * as  Interact from 'interact.js';
import { InteractStub } from '../../stubs';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import * as renderers from '../../../../src/renderers/index';
import using from 'jasmine-data-provider';

describe('the designer custom element', () => {
  let sut;
  let interactStub;

  beforeEach(() => {
    const interactFunc = jasmine.createSpy('interactFunc');
    interactStub = new InteractStub();
    interactFunc.and.returnValue(interactStub);

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
    const config = interactStub.dropzoneConfig;

    expect(sut.element.classList).toContain('dropzone');
    expect(config).toBeDefined();
    done();
  });

  it('adds and drops borders on callbacks', async done => {
    const classListSpy = jasmine.createSpyObj('classList', ['add', 'remove']);
    const event = {
      target: {
        classList: classListSpy
      }
    };

    await sut.create(bootstrap);

    const config = interactStub.dropzoneConfig;
    config.ondropactivate(event);
    config.ondropdeactivate(event);

    expect(config).toBeDefined();
    expect(classListSpy.add).toHaveBeenCalledWith('drop-active');
    expect(classListSpy.remove).toHaveBeenCalledWith('drop-active');
    done();
  });
});
