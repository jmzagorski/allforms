import { ExcelEngine } from './functions/excel/engine';
import { TemplateApi } from './api/template-api';

export class Formulas {
  static inject() { return [ ExcelEngine, TemplateApi ]; }

  constructor(xl, templateApi) {
    this.funcNames = xl.functions;
    this.verified = false;
    this.verifyMessage = null;
    this.variables = [];
    this.element = null;

    this._xl = xl;
    this._templateApi = templateApi;
  }

  showVariables() {
    if (!this.element || !this.element.formula) return;

    this.variables = [];
    const vars = this._xl.getVariables(this.element.formula);

    for (let v of vars) {
      this.variables.push({
        name: v,
        value: ''
      });
    };
  }

  async activate(model) {
    this.element = model;
    const $elements = this._templateApi.find(model.formId).elements;

    for (let i = 0; i < $elements.length; i++) {
      this.funcNames.push($elements[i].name);
    }
  }

  async verify() {
    for(let v of this.variables) {
      this._xl.setVariable(v.name, v.value);
    }

    const response = await this._xl.parse(this.element.formula);

    this.verified = !response.error;
    this.verifyMessage = response.error || response.result;
  }
}
