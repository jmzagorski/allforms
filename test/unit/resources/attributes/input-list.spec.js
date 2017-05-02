import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import { InputListService } from '../../../../src/elements/services/input-list-service';
import { setupSpy } from '../../jasmine-helpers';

describe('the input list custom attribute', () => {
  let sut;
  let dispose;
  let serviceSpy;

  beforeEach(() => {
    sut = StageComponent.withResources('resources/attributes/input-list');
    serviceSpy = setupSpy('service', InputListService.prototype);

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(InputListService, serviceSpy);
    };
  });

  afterEach(() => sut.dispose());

  it('creates the drawer to duplicate the element', async done => {
    sut.inView(`<input name="a" type="text" input-list>`);

    await sut.create(bootstrap);

    const $drawer = sut.element.nextSibling;
    expect($drawer.tagName).toEqual('DIV');
    expect($drawer.id).toEqual('a-drawer');
    expect($drawer.className).toEqual('collapse');

    const $btn = $drawer.nextSibling;
    expect($btn.tagName).toEqual('BUTTON');
    expect($btn.type).toEqual('button');
    expect($btn.getAttribute('data-toggle')).toEqual('collapse');
    expect($btn.getAttribute('data-target')).toEqual('#a-drawer');
    expect($btn.className).toEqual('btn btn-default btn-xs');
    expect($btn.style.backgroundColor).toEqual('transparent');

    const $glyph = $btn.children[0];
    expect($glyph.tagName).toEqual('SPAN');
    expect($glyph.className).toEqual('glyphicon glyphicon-resize-vertical');

    const $addBtn = $drawer.children[0];

    expect($addBtn.type).toEqual('button');
    expect($addBtn.tagName).toEqual('BUTTON');
    expect($addBtn.textContent).toEqual('+');
    expect($addBtn.className).toEqual('btn btn-success btn-xs');
    done();
  });

  it('add a new input on click', async done => {
    const cloned = {};
    serviceSpy.cloneSelf.and.returnValue(cloned);

    sut.inView(`<input name="a" type="text" input-list>`);
    await sut.create(bootstrap);

    const $addBtn = sut.element.nextSibling.children[0];
    $addBtn.click();

    setTimeout(() => {
      expect(serviceSpy.cloneSelf.calls.argsFor(0)[0]).toBe(sut.element);
      expect(serviceSpy.appendNext.calls.argsFor(0)[0]).toBe(sut.element);
      expect(serviceSpy.appendNext.calls.argsFor(0)[1]).toBe(cloned);
      done();
    })
  });

  it('does not create another drawer when on exists', async done => {
    const cloned = {};
    serviceSpy.cloneSelf.and.returnValue(cloned);

    sut.inView(`<input name="a" type="text" input-list><div id="a-drawer">
      <button type="button"></button></div>`);
    await sut.create(bootstrap);

    const $addBtn = sut.element.nextSibling.children[0];
    $addBtn.click();

    setTimeout(() => {
      expect(serviceSpy.cloneSelf).toHaveBeenCalled();
      expect(sut.element.nextSibling.nextSibling).toEqual(null)
      done();
    })
  });

  it('removes the click listener on detached', async done => {
    sut.inView(`<input name="a" type="text" input-list>`);
    await sut.create(bootstrap);

    sut.viewModel.detached();

    const $addBtn = sut.element.nextSibling.children[0];
    $addBtn.click();

    setTimeout(() => {
      expect(serviceSpy.cloneSelf).not.toHaveBeenCalled();
      done();
    })
  });
});
