import {
  Parser,
  SUPPORTED_FORMULAS
} from 'hot-formula-parser';
import {
  getIndicesOf,
  getEndingCharPos
} from '../../utils';
import {
  inject,
  All
} from 'aurelia-framework';

import { MACROS } from './macros';

@inject(Parser, All.of('ExcelMacros'))
export class ExcelEngine {

  constructor(parser, macros) {
    this._parser = parser;
    this._macros = macros;
    //this._cache = cache;
    //
    this._functions = SUPPORTED_FORMULAS.concat(MACROS);
  }

  get functions() {
    return this._functions;
  }

  // TODO - cache formula
  async parse(formula, args) {
    //let cached = cache.get(formula);

    //for (let a of args.filter(a => isObject(a)) {
    //const value = this._parser.getVariable(Object.keys(a)[0])
    //const cachedVal = cached.param[v];

    //if (cachedVal !== value) break;

    //return cachedVal;
    //}

    if (args) {
      for (let arg in args) this.setVariable(arg, args[arg]);
    }

    const cleanFormula = await this.expandMacros(formula, args);

    return this._parser.parse(cleanFormula);
  }

  /**
   * @summary Expands all macro functions in the formula
   */
  async expandMacros(formula, ...args) {
    let macroIndexes = [];

    for (let macro of this._macros) {
      // to upper because that is excel convention
      const indices = getIndicesOf(macro.constructor.name.toUpperCase(), formula);

      for (let index of indices) macroIndexes.push({ macro, index });
    }

    macroIndexes = macroIndexes.sort((a, b) => a.index - b.index);

    const replaces = [];
    for (let mi of macroIndexes) {
      const macroEndPos = getEndingCharPos(formula, mi.index, '(');
      const macroStr = formula.substring(mi.index, macroEndPos +1);
      const variables = this.getVariables(macroStr);
      const variableValues = variables.map(v => this._parser.getVariable(v));
      const func = await mi.macro.transform(variableValues);

      replaces.push({ original: macroStr, replace: func});
    }

    for (let replace of replaces) {
      formula = formula.replace(replace.original, replace.replace)
    }

    return formula;
  }

  getVariables(formula) {
    const variables = [];
    const variableRegex = /\b[A-Za-z]+\b(?!\(|")/g
    let match = null;

    while(match = variableRegex.exec(formula)) {
      variables.push(match[0]);
    }

    return variables;
  }

  setVariable(name, value) {
    this._parser.setVariable(name, value);
  }
}
