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

  it('creates many elements', () => {
    const elem1 = {};
    const elem2 = {};
    const options = {
      name: 'a',
      required: true,
      qty: 2
    };
    renderers.test = {
      fake: {
        create: jasmine.createSpy()
      }
    };

    renderers.test.fake.create.and.returnValues(elem1, elem2);

    const elements = factory.create('test', 'fake', options);

    expect(elements.length).toEqual(options.qty);
    expect(elements[0]).toBe(elem1);
    expect(elements[0].name).toEqual('a');
    expect(elements[0].required).toBeTruthy();
    expect(elements[1]).toBe(elem2);
    expect(elements[1].name).toEqual('a');
    expect(elements[1].required).toBeTruthy();
  });

  it('creates the without a required', () => {
    const options = {
      required: false,
      qty: 1
    };
    renderers.test = {
      fake: {
        create: jasmine.createSpy()
      }
    };

    renderers.test.fake.create.and.returnValue({});

    const elements = factory.create('test', 'fake', options);

    expect(elements[0].required).not.toBeDefined();
  });

  it('uses default options when none exists', () => {
    const options = { qty: 1 };
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
