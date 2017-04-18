export class ToggleFormatter {

  // FIXME: is there a better way to do this rather than rely on the interface
  // of _indent and _expanded?
  format(row, cell, value, columnDef, dataContext) {
    const indent = (15 * dataContext._indent) || 0;
    const spacer = `<span style="display:inline-block;height:1px;width:${indent}px"></span>`;

    if (!indent) {
      if (!dataContext._expanded) {
        return spacer + ' <span class="toggle expand"></span>&nbsp;' + value;
      }
      return spacer + ' <span class="toggle collapse"></span>&nbsp;' + value;
    }

    return spacer + ' <span class="toggle"></span>&nbsp;' + value;
  }
}
