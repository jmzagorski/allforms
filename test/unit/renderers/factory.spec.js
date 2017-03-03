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
    { required: true, expect: true },
    { required: false, expect: undefined }
  ], data => {
    it('creates the element and sets common attributes', () => {
      const expectElem = {};
      const options = {
        name: 'a',
        required: data.required,
        id: 1
      };
      renderers.test = {
        fake: {
          create: jasmine.createSpy()
        }
      };

      renderers.test.fake.create.and.returnValue(expectElem);

      const actualElem = factory.create('test', 'fake', options);

      expect(actualElem).toBe(expectElem);
      expect(actualElem.name).toEqual('a');
      expect(actualElem.required).toEqual(data.expect);
      expect(actualElem.id).toEqual(1);
    });
  });

  it('uses default options when none exists', () => {
    const options = { quantity: 1 };
    renderers.test = {
      fake: {
        create: jasmine.createSpy()
      }
    };

    defaultSpy.and.returnValue(options)
    renderers.test.fake.create.and.returnValue({});

    const elements = factory.create('test', 'fake');

    expect(defaultSpy).toHaveBeenCalledWith('fake');
    expect(renderers.test.fake.create.calls.argsFor(0)[0]).toBe(options);
  });
});
