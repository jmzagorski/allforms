import '../../setup';
import { date } from '../../../../src/renderers/bootstrap';

describe('the boostrap date renderer', () => {
  let sut;

  it('creates a bootstrap datepicker', () => {
    const options = { format: 'yyyymmdd' };

    const sut = date(options);

    expect(sut.tagName).toEqual('DIV');
    expect(sut.className).toEqual('input-group date');
    expect(sut.getAttribute('data-provide')).toEqual('datepicker');

    const input = sut.children[0];
    expect(input.tagName).toEqual('INPUT');
    expect(input.className).toEqual('form-control datepicker');
    expect(input.type).toEqual('text');
    expect(input.getAttribute('data-date-format')).toEqual(options.format);

    const addon = sut.children[1];
    expect(addon.tagName).toEqual('DIV');
    expect(addon.className).toEqual('input-group-addon');

    const span = addon.children[0];
    expect(span.tagName).toEqual('SPAN');
    expect(span.className).toEqual('glyphicon glyphicon-th');
  });

});
