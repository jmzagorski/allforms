import { ExcelEngine } from './functions/excel/engine';

export class Formulas {
  static inject() { return [ ExcelEngine ]; }

  constructor(xl) {
    this.funcNames = xl.functions;
    this.verified = false;
    this.verifyMessage = null;

    this._xl = xl;
  }

  activate(model) {
    this.element = model;
  }

  async verify() {
    const response = await this._xl.parse(this.element.formula);

    this.verified = !response.error;
    this.verifyMessage = response.error || response.result;
  }
}
