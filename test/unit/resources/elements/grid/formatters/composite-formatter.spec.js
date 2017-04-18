import { CompositeFormatter } from '../../../../../../src/resources/elements/grid/formatters/composite-formatter';

describe('the custom composite grid formatter', () => {
  let sut;
  let formatterMocks;

  beforeEach(() => {
    formatterMocks = [
      { constructor: { name: 'AFormatter' }, format: jasmine.createSpy('a') },
      { constructor: { name: 'BFormatter' }, format: jasmine.createSpy('b') },
    ]

    sut = new CompositeFormatter(formatterMocks);
  });

  it('throws if the formatter is not found', () => {
    const def = { custom: { formatters: [ 'C' ] } };

    const ex = () => sut.format(null, null, null, def, null);

    expect(ex).toThrow(new Error('C is not a registered GridFormatter'));
  });

  it('calls each formatter and returns the formatted value', () => {
    const def = { custom: { formatters: [ 'A', 'B' ] } };
    const row = 3;
    const cell = 4;
    const value = {};
    const context = {}
    const stubReturnOne = {};
    const stubReturnTwo = {};

    formatterMocks[0].format.and.returnValue(stubReturnOne);
    formatterMocks[1].format.and.returnValue(stubReturnTwo);

    const result = sut.format(row, cell, value, def, context);

    expect(formatterMocks[0].format.calls.argsFor(0)[0]).toEqual(3);
    expect(formatterMocks[1].format.calls.argsFor(0)[0]).toEqual(3);
    expect(formatterMocks[0].format.calls.argsFor(0)[1]).toEqual(4);
    expect(formatterMocks[1].format.calls.argsFor(0)[1]).toEqual(4);
    expect(formatterMocks[0].format.calls.argsFor(0)[2]).toBe(value);
    expect(formatterMocks[1].format.calls.argsFor(0)[2]).toBe(stubReturnOne);
    expect(formatterMocks[0].format.calls.argsFor(0)[3]).toBe(def);
    expect(formatterMocks[1].format.calls.argsFor(0)[3]).toBe(def);
    expect(formatterMocks[0].format.calls.argsFor(0)[4]).toBe(context);
    expect(formatterMocks[1].format.calls.argsFor(0)[4]).toBe(context);
    expect(result).toBe(stubReturnTwo);
  });
});
