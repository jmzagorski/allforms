import { ExcelEngine } from '../../../../src/functions/excel/engine';
import { FormulaService } from '../../../../src/elements/services/formula-service';
import { setupSpy } from '../../jasmine-helpers';
import $ from 'jquery';

describe('the formula form service', () => {
  let sut;
  let xlSpy;

  beforeEach(() => {
    xlSpy = setupSpy('xl', ExcelEngine.prototype);
    sut = new FormulaService(xlSpy);
  });

  [ { value: '', hidden: true },
    { value: '0', hidden: false },
  ].forEach(data => {
    it('hides empty outputs by default', () => {
      const $form = document.createElement('form');
      const $output = document.createElement('output');
      $output.value = data.value;
      $form.appendChild($output);

      sut.populate($form);

      expect($output.hidden).toEqual(data.hidden);
    });
  });

  it('calculates outputs', async done => {
    xlSpy.parse.and.returnValues({ result: 1 },{ result: 2 },{ result: 0 },
      { result: null }, { result: undefined });

    const $formStr = `<form>
      <output name="a" data-formula="SUM(1)"></output>
      <output name="b" data-formula="SUM(2)"></output>
      <output name="c" data-formula="SUM(3)"></output>
      <output name="d" data-formula="SUM(4)"></output>
      <output name="e" data-formula="SUM(5)"></output>
      </form>`;
    const $form = $($formStr).get(0);

    await sut.collect($form);

    const $outputs = $form.querySelectorAll('output');

    expect($outputs[0].value).toEqual('1');
    expect($outputs[0].hidden).toBeFalsy()
    expect($outputs[1].value).toEqual('2');
    expect($outputs[1].hidden).toBeFalsy()
    expect($outputs[2].value).toEqual('0');
    expect($outputs[2].hidden).toBeFalsy();
    expect($outputs[3].hidden).toBeTruthy();
    expect($outputs[4].hidden).toBeTruthy();
    done();
  });

  it('adds every element as a variable', async done => {
    xlSpy.parse.and.returnValue({ });
    const $formStr = `<form>
      <output name="a" data-formula="SUM(1)"></output>
      <input name="b" value="1">
      <input name="c" value="2">
      </form>`;
    const $form = $($formStr).get(0);

    xlSpy.setVariable.and.callFake(() => {
      expect(xlSpy.parse).not.toHaveBeenCalled();
    });

    await sut.collect($form);

    const $outputs = $form.querySelectorAll('output');

    expect(xlSpy.setVariable.calls.count()).toEqual(3);
    expect(xlSpy.setVariable).toHaveBeenCalledWith('a', '');
    expect(xlSpy.setVariable).toHaveBeenCalledWith('b', '1');
    expect(xlSpy.setVariable).toHaveBeenCalledWith('c', '2');
    expect(xlSpy.parse).toHaveBeenCalledWith('SUM(1)');
    done();
  });
})
