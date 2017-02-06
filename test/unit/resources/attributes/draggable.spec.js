import '../../setup';
import * as  Interact from 'interact.js';
import { InteractStub } from '../../stubs';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import using from 'jasmine-data-provider';

describe('the draggable custom attribute', () => {
  let sut;
  let interactStub;

  beforeEach(() => {
    const interactFunc = jasmine.createSpy('interactFunc');
    interactStub = new InteractStub();
    interactFunc.and.returnValue(interactStub);

    sut = StageComponent.withResources('resources/attributes/draggable');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(Interact, interactFunc);
    };

  });

  afterEach(() => sut.dispose());

  it('configures the draggable options', async done => {
    sut.inView(`<div draggable="test"></div>`);

    await sut.create(bootstrap)
    const config = interactStub.draggableConfig;

    expect(sut.element.classList).toContain('draggable');
    expect(config).toBeDefined();
    expect(config.inertia).toBeTruthy();
    expect(config.restrict).toEqual({
      restriction: 'test',
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 0, right: 0}
    });
    done();
  });

  using([
    { xAttr: 1, yAttr: 2, x: 2, y: 4 },
    { xAttr: null, yAttr: null, x: 1, y: 2 },
  ], data => {
    it('translates the elements position onmove', async done => {
      const getAttrSpy = jasmine.createSpy('getAttr');
      const setAttrSpy = jasmine.createSpy('setAttr');

      getAttrSpy.and.returnValues(data.xAttr, data.yAttr);

      const event = {
        target: {
          getAttribute: getAttrSpy,
          setAttribute: setAttrSpy,
          style: {
            webkitTransform: null,
            transform: null
          }
        },
        dx: 1,
        dy: 2
      };
      sut.inView(`<div draggable></div>`);

      await sut.create(bootstrap);
      const config = interactStub.draggableConfig;
      config.onmove(event);

      expect(getAttrSpy.calls.first().args).toEqual(['data-x']);
      expect(getAttrSpy.calls.mostRecent().args).toEqual(['data-y']);
      expect(event.target.style.webkitTransform)
        .toEqual(`translate(${data.x}px, ${data.y}px)`);
      expect(event.target.style.webkitTransform).toEqual(event.target.style.transform);
      expect(setAttrSpy.calls.first().args).toEqual(['data-x', data.x]);
      expect(setAttrSpy.calls.mostRecent().args).toEqual(['data-y', data.y]);
      done();
    });
  });

  it('emits drag end event on drag end', async done => {
    const rectSpy = jasmine.createSpy('boundingRect');
    const dispatchSpy = jasmine.createSpy('dispatch');
    const position = {};
    let emittedEvent = null;

    rectSpy.and.returnValues(position);
    dispatchSpy.and.callFake(e => emittedEvent = e)

    const event = {
      target: {
        getBoundingClientRect: rectSpy,
        dispatchEvent: dispatchSpy
      }
    };
    sut.inView(`<div draggable></div>`);

    await sut.create(bootstrap);
    const config = interactStub.draggableConfig;
    config.onend(event);

    expect(emittedEvent).not.toEqual(null);
    expect(emittedEvent.detail).toBeDefined();
    expect(emittedEvent.detail.position).toBe(position);
    expect(emittedEvent.bubbles).toBeTruthy();
    done();
  });
});
