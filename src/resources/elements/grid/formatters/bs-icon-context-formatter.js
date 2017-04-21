/**
 * @summary Bootstrap Fontawesome formatter based on class context
 */
export class BsIconContextFormatter {

  format(row, cell, value, columnDef, dataContext) {
    const icon = columnDef.custom.contextIcon;
    return `<span title="${value}" class="text-center text-${value}"><i class="${icon}" aria-hidden="true"></i></span>`
  }
}
