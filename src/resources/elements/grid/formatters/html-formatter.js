import { HTMLSanitizer } from 'aurelia-templating-resources';

export class HtmlFormatter {

  static inject = [ HTMLSanitizer ];

  constructor(sanitizer) {
    this._sanitizer = sanitizer;
  }

  format(row, cell, value, columnDef, dataContext) {
    const template = columnDef.custom.html;

    if (template) {
      return this._sanitizer.sanitize(template) + '&nbsp;' + (value || '');
    }

    return value;
  }
}
