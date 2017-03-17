import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import using from 'jasmine-data-provider';
import $ from 'jquery';
import 'jquery-textcomplete/dist/jquery.textcomplete.js';

describe('the text complete custom attribute', () => {
  let sut;
  let dispose;

  beforeEach(() => {
    sut = StageComponent.withResources('resources/attributes/textcomplete');
    dispose = true;

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
    };
  });

  afterEach(() => {
    if (dispose) sut.dispose();
  });

  using([
    { term: 'a', result: ['a'] },
    { term: 'd', result: [] }
  ], data => {
    it('sets the textcomplete properties', async done => {
      const context = { words:  [ 'a', 'b', 'c' ] };
      const txtSpy = spyOn($.fn, 'textcomplete');
      const cbSpy = jasmine.createSpy('cbSpy');
      let options = null;
      sut.inView(`<textarea textcomplete.bind="words"></textarea>`).boundTo(context)

      txtSpy.and.callFake((strategy, opts) => options = { strategy, opts });

      await sut.create(bootstrap);
      options.strategy[0].search(data.term, cbSpy)

      expect(options).not.toEqual(null);
      expect(options.strategy[0].match).toEqual(/\b(\w{1,})$/);
      expect(options.strategy[0].index).toEqual(1);
      expect(cbSpy).toHaveBeenCalledWith(data.result);
      expect(options.opts.noResultsMessage).toEqual('Nothing found');
      expect(options.opts.appendTo).toBe(sut.element.parentNode);
      expect(options.strategy[0].replace(1)).toEqual(1);
      done();
    });
  });
});
