import { All, inject } from 'aurelia-framework';

@inject(All.of('MacroProviders'))
export class MacroFactory {

  constructor(macroProviders) {
    this._macros = [];

    for (let provider of macroProviders) {
      this._macros.push(provider.provide())
    };
  }

  get macros() {
    return this._macros.map(m => m.constructor.name);
  }

  async run(macroName, parser, formula) {
    const macro = this._macros
      .find(m => m.constructor.name.toLowerCase() === macroName.toLowerCase());

    if (!macro) throw new Error(`${macroName} is not a supported macro`);

    return macro.run(parser, formula);
  }
}
