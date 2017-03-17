import * as date from '../../../src/elements/date';

describe('the date element', () => {

  it('has bootstrap date properties', () => {
    const sut = date.bootstrap();

    expect(sut.name).toBeDefined();
    expect(sut.required).toBeFalsy();
    expect(sut.text).toBeDefined();
    expect(sut.min).toEqual(stubCorrectDateFormat(new Date()));
    expect(sut.max).toBeDefined();
    expect(sut.schema).toBeDefined();
    expect(sut.schema).toContain('text.html');
    expect(sut.schema).toContain('name.html');
    expect(sut.schema).toContain('input.html');
    expect(sut.schema).toContain('range.html');
  });

  function stubCorrectDateFormat(date){
    let monthPadded = '0' + date.getMonth();
    let dayPadded = '0' + date.getDate();
    let year = date.getFullYear();

    return `${year}-${monthPadded.substr(monthPadded.length - 2)}-${dayPadded.substr(dayPadded.length - 2)}`;
  }
});
