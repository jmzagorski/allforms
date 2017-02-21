import '../../setup';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import using from 'jasmine-data-provider';

describe('the tool tip custom attribute', () => {
  let sut;

  beforeEach(() => {
    sut = StageComponent.withResources('resources/attributes/tooltip');
  });

  afterEach(() => sut.dispose());

  using([
    { placement: 'left', expect: 'left'},
    { placement: null, expect: 'top' },
    { expect: 'top' }
  ], data => {
    it('configures the tool tip with the message', async done => {
      const context = { options: { message:  'something', placement: data.placement } };
      sut.inView(`<div tooltip.bind="options"></div>`).boundTo(context);

      await sut.create(bootstrap);

      expect(sut.element.getAttribute('data-toggle')).toEqual('tooltip');
      expect(sut.element.getAttribute('data-placement')).toEqual(data.expect);
      expect(sut.element.getAttribute('title')).toEqual('something');
      done();
    });
  });
});
