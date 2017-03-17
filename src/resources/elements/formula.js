import { customElement, bindable } from 'aurelia-framework';
import { ExcelEngine } from '../../../src/functions/excel/engine';

@customElement('formula')
export class FormulaCustomElement {
  static inject() { return [ ExcelEngine, Element ]; }

  constructor(xl, element) {
    this.funcNames = xl.functions;
    this.verified = false;
    this.verifyMessage = null;
    this.formula = null;
    this.element = element;
    this.variables = [];

    this._xl = xl;
  }

  attached() {
    const $form = this.element.closest('form');
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
    };
  }

  async verify() {
    for(let v of this.variables) {
      this._xl.setVariable(v.name, v.value);
    }

    const response = await this._xl.parse(this.formula);

    this.verified = !response.error;
    this.verifyMessage = response.error || response.result;

    if (!response.error) this.value = response.result;

    const event = new CustomEvent('calculated', {
      bubbles: true,
      detail: {
        result:  response.result,
        variables: this.variables
      }
    });
    this.element.dispatchEvent(event)
  }
}
