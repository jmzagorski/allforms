import * as schemas from '../../../src/schemas/global.js';

const common = [{
  key: 'name',
  type: 'string'
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

const label = {
  key: 'label',
  type: 'string'
};

const text = {
  key: 'text',
  type: 'string'
};

describe('the global (shared) schemas', () => {
  let sut;

  it('sets the date schema', () => {
    const date = schemas.date;

    expect(date).toEqual([...common, label, {
      key: 'format',
      type: 'string',
      default: 'mm/dd/yyyy'
    }, {
      key: 'min',
      type: 'date'
    }, {
      key: 'max',
      type: 'date'
    }]);
  });

  it('sets the number schema', () => {
    const input = schemas.number;

    expect(input).toEqual([...common, label, {
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

    expect(option).toEqual([ ...common, label ]);
  });

  it('sets the radio schema', () => {
    const option = schemas.radio;

    expect(option).toEqual([ ...common, label ]);
  });

  it('sets the attachments schema', () => {
    const attachments = schemas.attachments;

    expect(attachments).toEqual([ common[1], label ]);
  });

  it('sets the label schema', () => {
    const label = schemas.label;

    expect(label).toEqual([ common[1], text ]);
  });

  it('sets the alert schema', () => {
    const alert = schemas.alert;

    expect(alert).toEqual([ common[0], common[1], text ]);
  });

  it('sets the select schema', () => {
    const select = schemas.select;

    expect(select).toEqual([ ...common, label, {
      key: 'optionSrc',
      type: 'file',
      label: 'Options File'
    }]);
  });

  it('sets the text schema', () => {
    const text = schemas.text;

    expect(text).toEqual([ ...common, label, {
      key: 'min',
      type: 'number',
      default: 0
    }, {
      key: 'max',
      type: 'number'
    }]);
  });

  it('sets the link schema', () => {
    const link = schemas.link;

    expect(link).toEqual([ common[1], text, {
      key: 'href',
      label: 'source',
      type: 'string'
    }]);
  });

  it('sets the iframe schema', () => {
    const iframe = schemas.iframe;

    expect(iframe).toEqual([{
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

    expect(header).toEqual([{
      key: 'Quantity',
      type: 'number',
      default: 1
    }, text, {
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

    expect(tab).toEqual([{
      key: 'headers',
      type: 'string'
    }]);
  });
});
