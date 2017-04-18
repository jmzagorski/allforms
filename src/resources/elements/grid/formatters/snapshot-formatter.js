export class SnapshotFormatter {

  format(row, cell, value, columnDef, dataContext) {
    if (dataContext.originalId) {
      return '<span><i class="fa fa-camera-retro"></i></span></span>&nbsp;' + value;
    }

    return value;
  }
}
