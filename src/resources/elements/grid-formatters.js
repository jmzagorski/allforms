import { Formatters } from 'slickgrid-es6';

const supported = Object.assign({}, Formatters); 
 // TODO create composite formatter that calls each ind. one so i can inject
  // helpers like html sanitizer

supported.Html = function (row, cell, value, columnDef, dataContext) {
  return columnDef.formatterOpts.html || value;
}

supported.Link = function (row, cell, value, columnDef, dataContext) {
  const parts = value.split('/');
  return `<a href="${value}">${parts[parts.length -1]}</a>`
}

export default supported;
