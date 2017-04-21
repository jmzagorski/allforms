import { BsIconContextFormatter } from '../../../../../../src/resources/elements/grid/formatters/bs-icon-context-formatter';

describe('the custom bootstrap icon context grid formatter', () => {
  let sut;

  beforeEach(() => {
    sut = new BsIconContextFormatter();
  });

  it('adds the value as the context with the custom icon', () => {
    const def = { custom: { contextIcon: [ 'C' ] } };
    const val = 'a';

    const formatted = sut.format(null, null, val, def, null);

    expect(formatted).toEqual('<span title="a" class="text-center text-a"><i class="C" aria-hidden="true"></i></span>')
  });
});
