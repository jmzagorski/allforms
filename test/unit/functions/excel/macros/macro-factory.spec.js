import { MacroFactory } from '../../../../../src/functions/excel/macros/macro-factory';

class MacroStub { 
  run() {
  }
}

class ProviderStub {
  constructor(macro) {
    this.macro = macro;
  }

  provide() {
    return this.macro;
  }
}

describe('the macro factory', () => {
  let sut;
  let macroStub;

  beforeEach(() => {
    macroStub = new MacroStub();
    sut = new MacroFactory([new ProviderStub(macroStub) ]);
  });

  it('maps the macro names', () => {
    expect(sut.macros).toEqual([ 'MacroStub' ]);
  });

  it('maps an empty array when no macros', () => {
    sut = new MacroFactory([]);

    expect(sut.macros).toEqual([]);
  });

  it('throws an err when macro name not found', async done => {
    sut = new MacroFactory([]);

    try {
      await sut.run('anything');
    } catch (e) {
      expect(e).toEqual(new Error('anything is not a supported macro'));
      done();
    }
  });

  it('runs the provided macro', async done => {
    const runSpy = spyOn(macroStub, 'run').and.returnValue(1);
    const parser = { id: 1 };
    const formula = 'aaaa';

    const result = await sut.run('MacroStub', parser, formula);
    
    expect(result).toEqual(1);
    expect(runSpy).toHaveBeenCalledWith(parser, formula);
    expect(runSpy.calls.count()).toEqual(1);
    done();
  });
});
