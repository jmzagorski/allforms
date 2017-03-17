import '../../setup';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper-webpack';
import { ExcelEngine } from '../../../../src/functions/excel/engine';
import { DOM } from 'aurelia-pal';
import { setupSpy } from '../../jasmine-helpers';

describe('the formula custom element', () => {
  let sut;
  let xlSpy;

  beforeEach(() => {
    xlSpy = setupSpy('xl', ExcelEngine.prototype);

    sut = StageComponent.withResources('resources/elements/formula');

    sut.configure = aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(ExcelEngine, xlSpy);
    };

    xlSpy.functions = [ 1 ];
  });

  afterEach(() => sut.dispose());

  it('instantiates the custom element', async done => {
    sut.inView('<formula></formula>').boundTo({});

    await sut.create(bootstrap);

    const $message = sut.element.querySelector('span');
    expect($message.className).toContain('aurelia-hide');
    expect(sut.viewModel.funcNames).toEqual([1]);
    expect(sut.viewModel.verified).toBeFalsy();
    expect(sut.viewModel.verifyMessage).toEqual(null);
    expect(sut.viewModel.variables).toEqual([]);
    expect(sut.viewModel.formula).toBeDefined();
    done();
  });

  it('finds the elements on an existing form', async done => {
    sut.inView('<form><input name="shouldnotfind"></form><form><input name="test"><formula></formula></form>');

    await sut.create(bootstrap);

    expect(sut.viewModel.funcNames).toContain('test');
    expect(sut.viewModel.funcNames).not.toContain('shouldnotfind');
    done();
  })

  it('adds the input listener to the area to find the variables', async done => {
    const notExpect = { name: 'c', value: ''}; // test clearing the variables
    sut.inView('<formula></formula>');
    xlSpy.getVariables.and.returnValue(['a', 'b']);

    await sut.create(bootstrap);
    sut.viewModel.variables = [ notExpect ];

    const $textarea = sut.element.querySelector('textarea');
    $textarea.dispatchEvent(new Event('input'));

    setTimeout(() => {
      expect(sut.viewModel.variables).toContain({ name: 'a', value: ''});
      expect(sut.viewModel.variables).toContain({ name: 'b', value: ''});
      expect(sut.viewModel.variables).not.toContain(notExpect);
      done();
    })
  });

  [ { error: null, alertName: 'alert-success', message: 'd' },
    { error: undefined, alertName: 'alert-success', message: 'd' },
    { error: 'xlerr', alertName: 'alert-danger', message: 'xlerr' }
  ].forEach(data => {
    it('verifies the formula', async done => {
      const var1 = { name: 'a', value: 1 };
      const var2 = { name: 'b', value: 2 };
      let variables = [];
      let value = null;
      const getResult = e => {
        value = e.detail.result;
        variables = e.detail.variables;
      };
      sut.inView('<formula calculated.delegate="getResult($event)"></formula>')
        .boundTo({ getResult });

      xlSpy.parse.and.returnValue({ result: data.message, error: data.error })

      await sut.create(bootstrap);
      sut.viewModel.variables = [ var1, var2]

      const $btn = sut.element.querySelector('button');
      const $span = sut.element.querySelector('span');
      const $textarea = sut.element.querySelector('textarea');
      $textarea.value = 'c';
      // trigger aurelia binding
      $textarea.dispatchEvent(new Event('change'));

      setTimeout(() => {
        $btn.click();

        setTimeout(() => {
          expect(xlSpy.setVariable.calls.count()).toEqual(2);
          expect(xlSpy.setVariable.calls.argsFor(0)).toEqual(['a', 1]);
          expect(xlSpy.setVariable.calls.argsFor(1)).toEqual(['b', 2]);
          expect(xlSpy.parse).toHaveBeenCalledWith('c');
          expect($span.className).toContain(data.alertName)
          expect($span.textContent).toEqual(data.message)
          expect(value).toEqual(data.message)
          expect(variables).toEqual([ var1, var2 ])
          done();
        })
      })
    });
  });
});
