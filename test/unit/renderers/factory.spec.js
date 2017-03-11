import * as factory from '../../../src/renderers/factory';
import * as renderers from '../../../src/renderers/index';
import * as defaultOpts from '../../../src/renderers/defaults';
import using from 'jasmine-data-provider';

describe('the renderer factory', () => {
  let sut;
  let defaultSpy;

  beforeEach(() => {
    defaultSpy = spyOn(defaultOpts, 'default');
  })

  it('throws when the renderer style is missing', () => {
    const ex = () => factory.create('notfound');

    expect(ex).toThrow(new Error('Style notfound is not supported'));
  });

  it('throws when the element renderer style is missing', () => {
    renderers.test = {};

    const ex = () => factory.create('test', 'notfound');

    expect(ex).toThrow(new Error('Style test does not have a notfound type'));
  });

  using([
    { required: true, expect: true, element: undefined, method: 'create' },
    { required: false, expect: undefined, element: undefined, method: 'create' },
    { required: true, expect: true, element: {}, method: 'update' },
    { required: false, expect: undefined, element: {}, method: 'update' }
  ], data => {
    it('creates the element', () => {
      const expectElem = document.createElement('div');
      const options = {
        name: 'a',
        mandatory: data.required,
        id: 1
      };
      renderers.test = {
        fake: {
          [data.method]: jasmine.createSpy()
        }
      };

      renderers.test.fake[data.method].and.returnValue(expectElem);

      const actualElem = factory.create('test', 'fake', options, data.element);

      expect(renderers.test.fake[data.method].calls.argsFor(0)[0]).toBe(options)
      expect(renderers.test.fake[data.method].calls.argsFor(0)[1]).toBe(data.element)
      expect(actualElem).toBe(expectElem);
    });
  });

  using([
    { required: true, element: document.createElement('input') },
    { required: false, element: document.createElement('select') }
  ], data => {
    it('sets common attributes on the input element', () => {
      const element = document.createElement('div').appendChild(data.element);
      const options = {
        name: 'a',
        mandatory: data.required,
        id: '1'
      };
      renderers.test = {
        fake: {
          create: () => element
        }
      };

      const actualElem = factory.create('test', 'fake', options);

      expect(element.name).toEqual('a');
      expect(element.required).toEqual(data.required);
      expect(actualElem.id).toEqual('1');
    });
  });

  using([
    { element: document.createElement('span') },
    { element: document.createElement('label') },
    { element: document.createElement('div') }
  ], data => {
    it('does not add input attributes for all other elements', () => {
      const element = document.createElement('div').appendChild(data.element);
      const options = {
        name: 'a',
        mandatory: true,
        id: 1,
      };
      renderers.test = {
        fake: {
          create: () => element
        }
      };

      const actualElem = factory.create('test', 'fake', options);

      expect(actualElem.id).toEqual('1');
      expect(actualElem.name).toEqual('a');
      expect(actualElem.required).not.toBeDefined();
    });
  });

  it('uses default options when none exists', () => {
    const options = { };
    renderers.test = {
      fake: {
        create: jasmine.createSpy()
      }
    };

    defaultSpy.and.returnValue(options)
    renderers.test.fake.create.and.returnValue(document.createElement('span'));

    const elements = factory.create('test', 'fake');

    expect(defaultSpy).toHaveBeenCalledWith('test', 'fake');
    expect(renderers.test.fake.create.calls.argsFor(0)[0]).toBe(options);
  });
});
