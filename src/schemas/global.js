// TODO - Mandatory should not be in the base
const baseSchema = [{
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

export const date = [ ...baseSchema, {
  key: 'format',
  type: 'string',
  default: 'mm/dd/yyyy'
}];

export const number = [ ...baseSchema, {
  key: 'min',
  type: 'number',
  default: 0
}, {
  key: 'max',
  type: 'number'
}];

export const checkbox = [ ...baseSchema ];
export const radio = [ ...baseSchema ];
export const attachments = [ ...baseSchema ];

export const label = [ ...baseSchema, {
  key: 'type',
  type: 'string'
}];

export const select = [ ...baseSchema, {
  key: 'optionSrc',
  type: 'file',
  label: 'Options File'
}];

export const text = [ ...baseSchema, {
  key: 'rows',
  type: 'number',
  default: 5
}];

export const link = [ ...baseSchema, {
  key: 'href',
  label: 'source',
  type: 'string'
}];

export const iframe = [ ...baseSchema, {
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
}];

export const header = [ ...baseSchema, {
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
}];

export const tab = [ ...baseSchema, {
  key: 'headers',
  type: 'string'
}];
