import './setup';
import * as formSelectors from '../../src/domain/form/form-selectors';
import * as elemSelectors from '../../src/domain/element/element-selectors';
import { MetadataDialog } from '../../src/metadata-dialog';
import { Store } from 'aurelia-redux-plugin';
import { DialogController } from 'aurelia-dialog';
import { ElementActions } from '../../src/domain/index';

describe('the metadata dialog view model', () => {
  let sut;
  let elemActionSpy;
  let formSelectorSpy;
  let elemSelectorSpy;
  let storeSpy
  let dialogSpy;

  beforeEach(() => {
    elemActionSpy = jasmine.setupSpy('elemAction', ElementActions.prototype);
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    dialogSpy = jasmine.setupSpy('dialog', DialogController.prototype);
    formSelectorSpy = spyOn(formSelectors, 'getActiveForm');
    elemSelectorSpy = spyOn(elemSelectors, 'getActiveElement');
    sut = new MetadataDialog(elemActionSpy, dialogSpy, storeSpy);

    formSelectorSpy.and.returnValue({ id: 'a', style: 'bootstrap' });
  });

  it('instantiates the view model', () => {
    expect(sut.element).toBeDefined();
    expect(sut.views).toEqual([ 'metadata', 'formulas' ]);
    expect(sut.currentView).toEqual('metadata');
  });

  using([ {}, null ], element => {
    it('sets an element with the type and style', async done => {
      const model = { id: 1, type: 'ab' };
      const state = {};
      storeSpy.getState.and.returnValue(state);
      formSelectorSpy.and.returnValue({ style: 'xx', id: 'test' });
      elemSelectorSpy.and.returnValue(element);

      // make sure we load the element first!
      elemActionSpy.loadElement.and.callFake(() => {
        expect(elemSelectorSpy.calls.count()).toEqual(0);
      });

      await sut.activate(model);

      expect(formSelectorSpy).toHaveBeenCalledWith(state);
      expect(elemActionSpy.loadElement).toHaveBeenCalledWith(1);
      expect(elemSelectorSpy).toHaveBeenCalledWith(state);
      expect(sut.element.type).toEqual('ab');
      expect(sut.element.style).toEqual('xx');

      if (element) {
        expect(sut.element).toBe(element);
      } else {
        expect(sut.element.formId).toEqual('test');
      }

      done();
    });
  });

  it('switches the current view', () => {
    sut.switchView('a');

    expect(sut.currentView).toEqual('a');
  });

  it('submits the form data', async done => {
    const element = {};
    elemSelectorSpy.and.returnValue(element);
    await sut.activate({ id: 1 })

    await sut.submit();

    expect(elemActionSpy.saveElement.calls.argsFor(0)[0]).toBe(element);
    expect(dialogSpy.ok.calls.argsFor(0)[0]).toBe(element);
    done();
  });

  it('cancels the dialog', async done => {
    await sut.cancel();

    expect(dialogSpy.cancel).toHaveBeenCalled();
    done();
  });
});
