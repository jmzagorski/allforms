import '../../setup';
import * as  Interact from 'interact.js';
import { InteractStub } from '../../stubs';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import using from 'jasmine-data-provider';

describe('the resizable custom attribute', () => {
  let sut;
  let interactStub;

  beforeEach(() => {
    const interactFunc = jasmine.createSpy('interactFunc');
    interactStub = new InteractStub();
    interactFunc.and.returnValue(interactStub);

    sut = StageComponent.withResources('resources/attributes/resizable');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(Interact, interactFunc);
    };

  });

  afterEach(() => sut.dispose());

  using(["true", "false"], enabled => {
    it('configures the resizable element', async done => {
      sut.inView(`<div resizable.bind="${enabled}"></div>`);

      await sut.create(bootstrap);
      let config = interactStub.options.resize;

      expect(sut.element.classList).toContain('resizable');
      expect(config).toBeDefined();
      // if this is true then you can resize just horizontal or veritcal, both
      // are changed at the same time
      expect(config.preserveAspectRatio).not.toBeDefined();
      expect(config.enabled).toEqual(enabled === 'true');
      expect(config.edges).toEqual({ left: true, right: true, bottom: true, top: true });
      done();
    });
  });

  it('fires handler on resizemove', async done => {
    const event = {
      target: {
        style: {}
      },
      rect: { width: 1, height: 2 }
    };
    sut.inView(`<div resizable.bind="true"></div>`);

    await sut.create(bootstrap);
    const interactEvent = interactStub.events.find(e => e.event === 'resizemove');

    expect(event).toBeDefined();
    interactEvent.callback(event)
    expect(event.target.style.width).toEqual('1px');
    expect(event.target.style.height).toEqual('2px');
    done();
  });

  it('watches the value change event', async done => {
    let value = true
    sut.inView(`<div resizable.bind="value"></div>`).boundTo({ value });
    await sut.create(bootstrap);
    let config = interactStub.options.resize;

    sut.viewModel.value = false;

    setTimeout(() => {
      expect(config.enabled).toEqual(false);
      done();
    });
  });

  it('unsets the interactable on unbind', async done => {
    sut.inView(`<div resizable.bind="true"></div>`);
    await sut.create(bootstrap)

    sut.viewModel.unbind();

    expect(interactStub.unset).toBeTruthy();
    done();
  });
});
