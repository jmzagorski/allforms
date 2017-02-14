// bootstrap schema overrides 

import * as globalSchemas from './global';

const _labelKey = globalSchemas.label.find(l => l.key === 'type');

export const label = [ 
  ...globalSchemas.label.filter(l => l !== _labelKey), {
    key: 'type',
    type: 'select',
    default: 'default',
    options: [
      { text: 'default', value: 'default' },
      { text: 'primary', value: 'primary' },
      { text: 'success', value: 'success' },
      { text: 'info', value: 'info' },
      { text: 'danger', value: 'danger' },
      { text: 'warning', value: 'warning' }
    ]
  }
];

export const tab = [ ...globalSchemas.tab, {
  key: 'type',
  type: 'select',
  default: 'tab',
  options: [
    { text: 'tab', value: 'tab' },
    { text: 'pill', value: 'pill' }
  ]
}];

export const date = globalSchemas.date;
export const number = globalSchemas.number;
export const checkbox = globalSchemas.checkbox;
export const radio = globalSchemas.radio;
export const select = globalSchemas.select;
export const text = globalSchemas.text;
export const link = globalSchemas.link;
export const iframe = globalSchemas.iframe;
export const header = globalSchemas.header;
export const attachments = globalSchemas.attachments;
