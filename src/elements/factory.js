import * as iframe from './iframe';
import * as label from './label';
import * as link from './link';
import * as header from './header';
import * as select from './select';
import * as tab from './tab';
import * as attachments from './attachments';
import * as date from './date';
import * as number from './number';
import * as text from './text';
import * as textarea from './textarea';
import * as checkbox from './checkbox';
import * as radio from './radio';
import * as formula from './formula';

const elements = {
  iframe,
  label,
  link,
  header,
  select,
  tab,
  attachments,
  date,
  number,
  text,
  textarea,
  checkbox,
  radio,
  formula
}

export default function create(style, type) {
  style = style.toLowerCase();
  type = type.toLowerCase();
  const creator = elements[type];

  if (style && creator[style]) return creator[style]();
  
  return creator.standard();
}
