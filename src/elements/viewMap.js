//make it easier to reference the element views

function toViewPath(view){
  return `${view}.html`
}

const viewMap = {
  attachment: toViewPath('attachment'),
  file: toViewPath('file'),
  formula: toViewPath('formula'),
  header: toViewPath('header'),
  href: toViewPath('href'),
  iframe: toViewPath('iframe'),
  input: toViewPath('input'),
  name: toViewPath('name'),
  options: toViewPath('options'),
  range: toViewPath('range'),
  tabs: toViewPath('tabs'),
  text: toViewPath('text'),
  textarea: toViewPath('textarea'),
  types: toViewPath('types')
}

export default viewMap;
