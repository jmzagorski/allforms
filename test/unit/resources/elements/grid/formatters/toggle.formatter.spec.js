import { ToggleFormatter } from '../../../../../../src/resources/elements/grid/formatters/toggle-formatter';

describe('the custom toggle grid formatter', () => {
  let sut;

  beforeEach(() => sut = new ToggleFormatter());

  it('returns a class without an expand or collapse when is not root', () => {
    const value = 'blah';
    const context = { _indent: 1 };
    const spacer = `<span style="display:inline-block;height:1px;width:15px"></span>`;
    const toggle = ' <span class="toggle"></span>&nbsp;blah'; 

    const result = sut.format(null, null, value, null, context);

    expect(result).toEqual(spacer + toggle);
  });

  [ { _expanded: true, className: 'collapse' },
    { _expanded: false, className: 'expand' }
  ].forEach(rec => {
  it('returns a class without an expand or collapse when is not root', () => {
    const value = 'blah';
    const context = { _expanded: rec._expanded };
    const spacer = '<span style="display:inline-block;height:1px;width:0px"></span>';
    const toggle = ` <span class="toggle ${rec.className}"></span>&nbsp;blah`;

    const result = sut.format(null, null, value, null, context);

    expect(result).toEqual(spacer + toggle);
  });
  });
});
