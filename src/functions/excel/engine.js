import {
  Parser,
  SUPPORTED_FORMULAS
} from 'hot-formula-parser';

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
    this._functions = SUPPORTED_FORMULAS.concat(MACROS)
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
    const expandedMacros = [];

    for (let macro of this._macros) {
      // to upper because that is excel convention
      const indices = getIndicesOf(macro.constructor.name.toUpperCase(), formula); 

      for (let index of indices) macroIndexes.push({ macro, index });
    }

    macroIndexes = macroIndexes.sort((a,b) => a.index - b.index);

    for (let mi of macroIndexes) {
      debugger;
      const func = await mi.macro.transform(...args)
      formula = this._replaceText(formula, mi.macro.constructor.name.toUpperCase(), func);
    }

    return formula;
  }

  _getObjectArgVal(obj) {
    return obj[Object.keys(obj)[0]];
  }

  _replaceText(formula, search, replace) {
    let index = 0;
    while((index = formula.indexOf(search)) !== -1) {
      const end = getEndingCharPos(formula, index, '(')
      formula = replaceBetween(formula, index, end + 1, replace);
    }

    return formula;
  }
}
