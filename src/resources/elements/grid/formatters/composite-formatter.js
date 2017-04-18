import { All } from 'aurelia-framework';

export class CompositeFormatter {

  static inject = [ All.of('GridFormatters') ];

  constructor(formatters) {
    this._formatters = formatters;
  }

  format(row, cell, value, columnDef, dataContext) {
    let formatted = value;

    for (let fname of columnDef.custom.formatters) {
      const formatter = this._formatters.find(f => f.constructor.name === fname + 'Formatter');

      if (!formatter) throw new Error(`${fname} is not a registered GridFormatter`);

      formatted = formatter.format(row, cell, formatted, columnDef, dataContext);
    }

    return formatted;
  }
}
