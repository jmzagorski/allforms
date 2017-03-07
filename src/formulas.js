import { ExcelEngine } from './functions/excel/engine';
import { TemplateApi } from './api/template-api';

export class Formulas {
  static inject() { return [ ExcelEngine, TemplateApi ]; }

  constructor(xl, templateApi) {
    this.funcNames = xl.functions;
    this.verified = false;
    this.verifyMessage = null;

    this._xl = xl;
    this._templateApi = templateApi;
  }

  async activate(model) {
    this.element = model;
    const $elements = this._templateApi.find(model.formId).elements;

    for (let i = 0; i < $elements.length; i++) {
      this.funcNames.push($elements[i].name);
    }
  }

  async verify() {
    const response = await this._xl.parse(this.element.formula);

    this.verified = !response.error;
    this.verifyMessage = response.error || response.result;
  }
}
