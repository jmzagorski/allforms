const textSchema = {
  key: 'text',
  type: 'string'
};

const minSchema = {
  key: 'min',
  type: 'number',
  default: 0
};

const maxSchema = {
  key: 'max',
  type: 'number'
};

const requiredSchema = {
  key: 'mandatory',
  type: 'bool',
  default: false,
  label: false
};

const nameSchema = {
  key: 'name',
  type: 'string'
};

// many elements use this schema
const base = [ nameSchema, requiredSchema ];

export const date = [ ...base, textSchema, {
  key: 'min',
  type: 'date'
}, {
  key: 'max',
  type: 'date'
}];

export const number = [ ...base, textSchema, minSchema, maxSchema ];
export const checkbox = [ ...base, textSchema ];
export const radio = [ ...base, textSchema ];
export const attachments = [ textSchema ];
export const label = [ textSchema ];
export const alert = [ nameSchema, textSchema ];

export const select = [ ...base, textSchema, {
  key: 'optionSrc',
  type: 'file',
  label: 'Options File'
}];

// min and max can be validated in HTML5 with pattern .{min, max}
export const text = [ ...base, textSchema, minSchema, maxSchema ];

export const link = [ textSchema, {
  key: 'href',
  label: 'source',
  type: 'string'
}];

export const iframe = [{
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

export const header = [ textSchema, {
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

export const tab = [{
  key: 'headers',
  type: 'string'
}];
