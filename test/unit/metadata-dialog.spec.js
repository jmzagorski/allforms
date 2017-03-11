import * as formSelectors from '../../src/domain/form/form-selectors';
import * as elemSelectors from '../../src/domain/element/element-selectors';
import { MetadataDialog } from '../../src/metadata-dialog';
import { Store } from 'aurelia-redux-plugin';
import { DialogController } from 'aurelia-dialog';
import { ElementActions } from '../../src/domain/index';
import { setupSpy} from './jasmine-helpers';
import using from 'jasmine-data-provider';

describe('the metadata dialog view model', () => {
  let sut;
  let elemActionSpy;
  let formSelectorSpy;
  let elemSelectorSpy;
  let storeSpy
  let dialogSpy;

  beforeEach(() => {
    elemActionSpy = setupSpy('elemAction', ElementActions.prototype);
    storeSpy = setupSpy('store', Store.prototype);
    dialogSpy = setupSpy('dialog', DialogController.prototype);
    formSelectorSpy = spyOn(formSelectors, 'getActiveForm');
    elemSelectorSpy = spyOn(elemSelectors, 'getActiveElement');
    sut = new MetadataDialog(elemActionSpy, dialogSpy, storeSpy);

    formSelectorSpy.and.returnValue({ id: 'a', style: 'bootstrap' });
  });

  it('instantiates the view model', () => {
    expect(sut.newModel).toBeDefined();
    expect(sut.views).toEqual([ 'metadata', 'formulas' ]);
    expect(sut.currentView).toEqual('metadata');
  });

  using([ { aa: 1 }, null ], element => {
    it('sets the new model from element, form and passed in model', async done => {
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
      expect(sut.newModel.elementType).toEqual('ab');
      expect(sut.newModel.formStyle).toEqual('xx');
      expect(sut.newModel.formId).toEqual('test');

      if (element) expect(sut.aa).toBe(element.id);

      done();
    });
  });

  it('switches the current view', () => {
    sut.switchView('a');

    expect(sut.currentView).toEqual('a');
  });

  it('submits the form data', async done => {
    const element = { aa: 1 };
    sut.newModel = { bb: 2 }

    elemSelectorSpy.and.returnValue(element);

    await sut.submit();

    expect(elemActionSpy.saveElement.calls.argsFor(0)[0]).toBe(sut.newModel);
    expect(dialogSpy.ok.calls.argsFor(0)[0]).toEqual({ aa: 1, bb: 2 });
    done();
  });

  it('cancels the dialog', async done => {
    await sut.cancel();

    expect(dialogSpy.cancel).toHaveBeenCalled();
    done();
  });
});
