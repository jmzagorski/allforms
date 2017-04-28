import { ExcelEngine } from '../../functions/excel/engine';

export class FormulaService {

  static inject = [ ExcelEngine ];

  constructor(formulaParser) {
    this._formulaParser = formulaParser;
  }

  populate($form) {
    for (let i = 0; i < $form.elements.length; i++) {
      const $elem = $form.elements[i];

      if ($elem.tagName === 'OUTPUT' && !$elem.value) $elem.hidden = true;
    }
  }

  async collect($form, fd) {
    const $formulas = [];

    for (let i = 0; i < $form.elements.length; i++) {
      const $elem = $form.elements[i];

      if ($elem.getAttribute('data-formula')) {
        $formulas.push($elem);
      }

      this._formulaParser.setVariable($elem.name, $elem.value);
    }

    // solve outputs last to ensure all other values are ready
    for (let i = 0; i < $formulas.length; i++) {
      const $formula = $formulas[i];
      const fx = $formula.getAttribute('data-formula');
      const val = await this._formulaParser.parse(fx);

      if (val.result !== null) {
        $form.elements[$formula.name].value = val.result;
        fd.append($formula.name, val.result);
        $formula.hidden = false;
      } else {
        $formula.hidden = true;
      }
    }
  }
}
