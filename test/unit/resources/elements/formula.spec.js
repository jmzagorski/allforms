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
    expect(sut.viewModel.result).toBeDefined();
    expect(sut.viewModel.formid).toBeDefined();
    done();
  });

  it('finds the elements on an existing form', async done => {
    const context = {
      formid: 1
    };
    const $form = document.createElement('form');
    const $input = document.createElement('input');
    $input.name = 'a';
    $form.id = context.formid;
    $form.appendChild($input)

    sut.inView('<formula></formula>').boundTo(context);
    spyOn(DOM, 'getElementById').and.returnValue($form);

    await sut.create(bootstrap);

    expect(sut.viewModel.funcNames).toContain('a');
    done();
  })

  it('adds the input listener to the area to find the variables', async done => {
    const context = {
      variables: [ { name: 'c', value: ''} ] // test clearing the variables
    }
    sut.inView('<formula variables.bind="variables"></formula>')
      .boundTo(context);
    xlSpy.getVariables.and.returnValue(['a', 'b']);

    await sut.create(bootstrap);

    const $textarea = sut.element.querySelector('textarea');
    $textarea.dispatchEvent(new Event('input'));

    setTimeout(() => {
      expect(sut.viewModel.variables).toContain({ name: 'a', value: ''});
      expect(sut.viewModel.variables).toContain({ name: 'b', value: ''});
      expect(sut.viewModel.variables).not.toContain(context.variables);
      done();
    })
  });

  [ { error: null, alertName: 'alert-success', message: 'd', result: 'd' },
    { error: undefined, alertName: 'alert-success', message: 'd', result: 'd' },
    { error: 'xlerr', alertName: 'alert-danger', message: 'xlerr', result: null }
  ].forEach(data => {
    it('verifies the formula', async done => {
      const var1 = { name: 'a', value: 1 };
      const var2 = { name: 'b', value: 2 };
      const context = {
        variables: [ var1, var2 ],
        result: null,
        formula: null
      };
      sut.inView('<formula formula.two-way="formula" result.two-way="result" variables.two-way="variables"></formula>')
        .boundTo(context);

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
          expect($span.className).toContain(data.alertName);
          expect($span.textContent).toEqual(data.message);
          expect(context.result).toEqual(data.result);
          expect(context.formula).toEqual('c');
          expect(context.variables).toEqual([ var1, var2 ]);
          done();
        })
      })
    });
  });
});
