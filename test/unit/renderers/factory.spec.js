import '../setup';
import * as factory from '../../../src/renderers/factory';
import * as renderers from '../../../src/renderers/index';
import * as defaultOpts from '../../../src/renderers/defaults';

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
    it('creates the element and sets common attributes', () => {
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
    { required: true, name: 'a', id: '1', element: document.createElement('input') },
    { required: false, name: 'a', id: '1', element: document.createElement('select') }
  ], expected => {
    it('adds input attributes', () => {
      const options = {
        name: expected.name,
        mandatory: expected.required,
        id: expected.id,
      };
      renderers.test = {
        fake: {
          create: () => expected.element
        }
      };

      const actualElem = factory.create('test', 'fake', options);

      expect(actualElem.name).toEqual(expected.name);
      expect(actualElem.required).toEqual(expected.required);
      expect(actualElem.id).toEqual(expected.id);
    });
  });

  using([
    { element: document.createElement('span') },
    { element: document.createElement('label') },
    { element: document.createElement('div') }
  ], data => {
    it('does not add input attributes for all other elements', () => {
      const options = {
        name: 'a',
        mandatory: true,
        id: 1,
      };
      renderers.test = {
        fake: {
          create: () => data.element
        }
      };

      const actualElem = factory.create('test', 'fake', options);

      expect(actualElem.id).toEqual('');
      expect(actualElem.name).not.toBeDefined();
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

    expect(defaultSpy).toHaveBeenCalledWith('fake');
    expect(renderers.test.fake.create.calls.argsFor(0)[0]).toBe(options);
  });
});
