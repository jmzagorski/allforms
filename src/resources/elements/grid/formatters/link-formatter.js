export class LinkFormatter {

  format(row, cell, value, columnDef, dataContext) {
    const parts = value.split('/');
    return `<a href="${value}">${parts[parts.length - 1]}</a>`;
  }
}
