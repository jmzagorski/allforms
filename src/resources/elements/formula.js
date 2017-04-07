import { customElement, bindable } from 'aurelia-framework';
import { ExcelEngine } from '../../../src/functions/excel/engine';
import { DOM } from 'aurelia-pal';

@customElement('formula')
export class FormulaCustomElement {
  @bindable variables = [];
  @bindable result;
  @bindable formula;
  @bindable formid;

  static inject() { return [ ExcelEngine, Element ]; }

  constructor(xl, element) {
    this.funcNames = xl.functions;
    this.verified = false;
    this.verifyMessage = null;
    this.element = element;

    this._xl = xl;
  }

  attached() {
    const $form = DOM.getElementById(this.formid);
    const $textarea = this.element.querySelector('textarea');

    $textarea.addEventListener('input', () => this.showVariables());

    if (!$form) return;

    for (let i = 0; i < $form.elements.length; i++) {
      this.funcNames.push($form.elements[i].name);
    }
  }

  showVariables() {
    this.variables = [];
    const vars = this._xl.getVariables(this.formula);

    for (let v of vars) {
      this.variables.push({
        name: v,
        value: ''
      });
    }
  }

  async verify() {
    for (let v of this.variables) {
      this._xl.setVariable(v.name, v.value);
    }

    const response = await this._xl.parse(this.formula);

    this.verified = !response.error;
    this.verifyMessage = response.error || response.result;

    if (!response.error) this.result = response.result;
  }
}
