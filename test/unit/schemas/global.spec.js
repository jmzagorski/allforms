import * as schemas from '../../../src/schemas/global.js';

const shouldBeInAll = [{
  key: 'name',
  type: 'string'
}, {
  key: 'Create label from name',
  type: 'bool',
  default: true,
  label: false
}, {
  key: 'Quantity',
  type: 'number',
  default: 1
}, {
  key: 'mandatory',
  type: 'bool',
  default: false,
  label: false
}];

describe('the global (shared) schemas', () => {
  let sut;

  it('sets the date schema', () => {
    const date = schemas.date;

    expect(date).toEqual([...shouldBeInAll, {
      key: 'format',
      type: 'string',
      default: 'mm/dd/yyyy'
    }]);
  });

  it('sets the number schema', () => {
    const input = schemas.number;

    expect(input).toEqual([...shouldBeInAll, {
      key: 'min',
      type: 'number',
      default: 0
    }, {
      key: 'max',
      type: 'number'
    }]);
  });

  it('sets the checkbox schema', () => {
    const option = schemas.checkbox;

    expect(option).toEqual(shouldBeInAll);
  });

  it('sets the radio schema', () => {
    const option = schemas.radio;

    expect(option).toEqual(shouldBeInAll);
  });

  it('sets the attachments schema', () => {
    const attachments = schemas.attachments;

    expect(attachments).toEqual(shouldBeInAll);
  });

  it('sets the label schema', () => {
    const label = schemas.label;

    expect(label).toEqual(shouldBeInAll);
  });

  it('sets the alert schema', () => {
    const alert = schemas.alert;

    expect(alert).toEqual(shouldBeInAll);
  });

  it('sets the select schema', () => {
    const select = schemas.select;

    expect(select).toEqual([ ...shouldBeInAll, {
      key: 'optionSrc',
      type: 'file',
      label: 'Options File'
    }]);
  });

  it('sets the text schema', () => {
    const text = schemas.text;

    expect(text).toEqual([ ...shouldBeInAll, {
      key: 'rows',
      type: 'number',
      default: 5
    }]);
  });

  it('sets the link schema', () => {
    const link = schemas.link;

    expect(link).toEqual([ ...shouldBeInAll, {
      key: 'href',
      label: 'source',
      type: 'string'
    }]);
  });

  it('sets the iframe schema', () => {
    const iframe = schemas.iframe;

    expect(iframe).toEqual([ ...shouldBeInAll, {
      key: 'href',
      label: 'source',
      type: 'string'
    }, {
      key: 'width',
      type: 'number',
      default: 700
    }, {
      key: 'height',
      type: 'number',
      default: 300
    }]);
  });

  it('sets the header schema', () => {
    const header = schemas.header;

    expect(header).toEqual([ ...shouldBeInAll, {
      key: 'size',
      type: 'select',
      default: 1,
      options: [
        { text: 1, value: 1 },
        { text: 2, value: 2 },
        { text: 3, value: 3 },
        { text: 4, value: 4 },
        { text: 5, value: 5 },
        { text: 6, value: 6 }
      ]
    }]);
  });

  it('sets the tab schema', () => {
    const tab = schemas.tab;

    expect(tab).toEqual([ ...shouldBeInAll, {
      key: 'headers',
      type: 'string'
    }]);
  });
});
