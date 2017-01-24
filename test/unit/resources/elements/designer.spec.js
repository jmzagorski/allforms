import $ from 'jquery';
import '../../setup';
import * as interactjs from 'interactjs';
import {InteractStub} from '../../stubs';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper-webpack';
import {DOM} from 'aurelia-pal';
import using from 'jasmine-data-provider';

describe('the designer custom element', () => {
  let sut;
  let interactStub;

  beforeEach(() => {
    interactStub = new InteractStub();
    spyOn(interactjs, 'interact').and.returnValue(interactStub);

    sut = StageComponent
      .withResources('resources/elements/designer');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
    };

  });

  afterEach(() => {
    sut.dispose();
  });

  it('configures the drop zone', async done => {
    sut.inView(`<designer></designer>`);

    await sut.create(bootstrap);

    const config = interactStub.dropzoneConfig;

    expect(config).toBeDefined();
    expect(config.accept).toEqual('.drag-drop');
    expect(config.overlap).toEqual(0.75);
    done();
  });

  it('adds and drops borders on callbacks', async done => {
    const classListSpy = jasmine.createSpyObj('classList', ['add', 'remove']);
    const event = {
      target: {
        classList: classListSpy
      }
    };
    sut.inView(`<designer></designer>`);

    await sut.create(bootstrap);

    const config = interactStub.dropzoneConfig;
    config.ondropactivate(event);
    config.ondropdeactivate(event);

    expect(config).toBeDefined();
    expect(config.accept).toEqual('.drag-drop');
    expect(config.overlap).toEqual(0.75);
    expect(classListSpy.add).toHaveBeenCalledWith('drop-active');
    expect(classListSpy.remove).toHaveBeenCalledWith('drop-active');
    done();
  });

  it('configures the draggable object', async done => {
    sut.inView(`<designer boundary.bind="boundary"></designer>`)
      .boundTo({boundary: 'edges'});

    await sut.create(bootstrap)

    const config = interactStub.draggableConfig;

    expect(config).toBeDefined();
    expect(config.inertia).toBeTruthy();
    expect(config.restrict).toEqual({
      restriction: 'edges',
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 0, right: 0}
    });
    done();
  });

  // TODO it uses the injected view but i am not sure stub that
  it('uses another object if no boundary given', async done => {
    sut.inView(`<designer boundary.bind="boundary"></designer>`)
      .boundTo({boundary: null});

    await sut.create(bootstrap)

    const config = interactStub.draggableConfig;

    expect(config.restrict.restriction).toEqual(jasmine.any(Object));
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
      sut.inView(`<designer></designer>`);

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

  // TODO test to make sure the value and label in the select are correct
  it('inserts the selected element into the DOM', async done => {
    sut.inView(`<designer></designer>`)

    await sut.create(bootstrap);

    const select = document.querySelector('select');
    let input = document.querySelector('input');
    select.value = 'input';

    expect(input).toEqual(null);

    // simulate change event
    const changeEvent = new CustomEvent('change', { bubbles: true })
    select.dispatchEvent(changeEvent);

    input = document.querySelector('.dropzone').previousSibling;
    expect(input.tagName).toEqual('INPUT');
    expect(input).not.toEqual(null);
    expect(input.className).toEqual('draggable drag-drop resizable');
    // let the binding firing
    setTimeout(() => {
      expect(select.value).toEqual('');
      done();
    });
  })
});
