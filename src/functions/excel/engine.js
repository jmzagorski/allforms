import { Parser, SUPPORTED_FORMULAS } from 'hot-formula-parser';
import { getIndicesOf, getEndingCharPos } from '../../utils';
import { MacroFactory } from './macros/macro-factory';

export class ExcelEngine {

  static inject = [ Parser, MacroFactory ];

  constructor(parser, macroFactory) {
    this._parser = parser;
    this._macroFactory = macroFactory;
    this._macros = macroFactory.macros.map(m => m.toUpperCase());
    this._functions = SUPPORTED_FORMULAS.concat(this._macros);
  }

  get functions() {
    return this._functions;
  }

  async parse(formula) {
    const cachedResult = this._parser.getVariable(formula);

    if (cachedResult != null) return cachedResult;

    const cleanFormula = await this._runMacros(formula);

    const result =  this._parser.parse(cleanFormula);
    this.setVariable(formula, result);

    return result
  }

  getVariables(formula) {
    const variables = [];
    // find variables that are one word and not next to a " or anything that
    // looks like a URL since that can be within a string
    const variableRegex = /\b[A-Za-z]+\b(?!\(|"|\/|\.|\:)/g;
    let match = null;

    while (match = variableRegex.exec(formula)) { // eslint-disable-line no-cond-assign
      variables.push(match[0]);
    }

    return variables;
  }

  setVariable(name, value) {
    this._parser.setVariable(name, value);
  }

  getVariableValue(name) {
    return this._parser.getVariable(name);
  }

  getValues(formula) {
    const values = [];
    // find everything between double quotes or numbers
    const valueRegex = /"(.*?)"|[0-9]+/g;
    let match = null;

    while (match = valueRegex.exec(formula)) { // eslint-disable-line no-cond-assign
      values.push(match[0].replace(/"/g, '')); // do not include the actual quotes
    }

    return values;
  }

  /**
   * @summary Run all macro functions in the formula
   */
  async _runMacros(formula) {
    let macros = [];

    for (let macroName of this._macros) {
      const indicies = getIndicesOf(macroName, formula);
      
      for (let index of indicies) {
        macros.push({ index,  name: macroName });
      }
    }

    macros = macros.sort((a, b) => a.index - b.index);

    const replaces = [];
    for (let macro of macros) {
      const endPos = getEndingCharPos(formula, macro.index, '(');
      const macroStr = formula.substring(macro.index, endPos + 1);
      const func = await this._macroFactory.run(macro.name, this, macroStr);

      // make sure you replace after the iteration or your positions will change
      replaces.push({ original: macroStr, replace: func});
    }

    for (let replace of replaces) {
      formula = formula.replace(replace.original, replace.replace);
    }

    return formula;
  }
}
