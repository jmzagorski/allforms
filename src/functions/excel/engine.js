import {
  Parser,
  SUPPORTED_FORMULAS
} from 'handsontable/formula-parser';

import {
  isObject,
  getIndicesOf,
  replaceBetween,
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
  async parse(formula, ...args) {
    //let cached = cache.get(formula);

    //for (let a of args.filter(a => isObject(a)) {
      //const value = this._parser.getVariable(Object.keys(a)[0])
      //const cachedVal = cached.param[v];

      //if (cachedVal !== value) break;

      //return cachedVal;
    //}

    for (let arg of args) {
      if (isObject(arg)) {
        const value = this._getObjectArgVal(arg);
        const key = Object.keys(arg)[0];
        this._parser.setVariable(key, value);
      }
    }

    const cleanFormula = await this.expandMacros(formula, args);

    return this._parser.parse(cleanFormula);
  }

  /**
   * @summary Expands all macro functions in the formula
   *
   */
  async expandMacros(formula, ...args) {
    let macroIndexes = [];

    for (let macro of this._macros) {
      // to upper because that is excel convention
      const indices = getIndicesOf(macro.constructor.name.toUpperCase(), formula);

      for (let index of indices) macroIndexes.push({ macro, index });
    }

    macroIndexes = macroIndexes.sort((a, b) => a.index - b.index);

    for (let mi of macroIndexes) {
      const func = await mi.macro.transform(...args);
      formula = this._replaceText(formula, mi.macro.constructor.name.toUpperCase(), func);
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

  _getObjectArgVal(obj) {
    return obj[Object.keys(obj)[0]];
  }

  _replaceText(formula, search, replace) {
    let match = null;

    while ((match = formula.match(`\\b${search}\\b`))) { // eslint-disable-line no-cond-assign
      const end = getEndingCharPos(formula, match.index, '(');
      formula = replaceBetween(formula, match.index, end + 1, replace);
    }

    return formula;
  }
}
