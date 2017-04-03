import { TemplatingEngine } from 'aurelia-framework';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';

describe('the enhance html custom attribute', () => {
  let sut;

  beforeEach(() => {
    sut = StageComponent.withResources('resources/attributes/enhance-html');
  });

  afterEach(() => sut.dispose());

  it('enhances all the children', async done => {
    const context = { html: 'html' };
    sut.inView(`<div enhance-html.bind="html"><a href=""></a><form><input></form></div>`)
      .boundTo(context);

    const enhanceSpy = spyOn(TemplatingEngine.prototype, 'enhance').and.callThrough();

    await sut.create(bootstrap)

    const $link = sut.element.querySelector('a');
    const $form = sut.element.querySelector('form');

    // 2 calls from the sut and 1 extra from aurelia-testing
    const allCalls = enhanceSpy.calls.all();
    const aureliaCall = allCalls[0].args[0];
    const myFirstCall = allCalls[1].args[0];
    const mySecondCall = allCalls[2].args[0];

    expect(enhanceSpy.calls.count()).toEqual(3);
    expect(myFirstCall.element).toBe($link);
    expect(myFirstCall.bindingContext).toBe(context);
    expect(myFirstCall.resources).toEqual(aureliaCall.resources);
    expect(mySecondCall.element).toBe($form);
    expect(mySecondCall.bindingContext).toBe(context);
    expect(mySecondCall.resources).toEqual(aureliaCall.resources);
    done();
  });

  it('does not enhance twice', async done => {
    const context = { html: 'html' };
    sut.inView(`<div enhance-html.bind="html"><a href=""></a></div>`)
      .boundTo(context);

    const enhanceSpy = spyOn(TemplatingEngine.prototype, 'enhance').and.callThrough();

    await sut.create(bootstrap)

    const $link = sut.element.querySelector('a');

    // trigger aurelia change binding
    context.html = 'changed'

    // set timeout so aurelia binding can be called
    setTimeout(() => {
      // it would be 3 if i did not cache the enhanced
      // (1 for aurelia call, 1 for first time and 1 for second time)
      expect(enhanceSpy.calls.count()).toEqual(2);
      done();
    })
  });
});
