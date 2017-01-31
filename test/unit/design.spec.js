import './setup';
import { ElementActions } from '../../src/domain/index';
import { Design } from '../../src/design';
import { Store } from 'aurelia-redux-plugin';

describe('the design view model', () => {
  let sut;
  let elemActionSpy;
  let storeSpy

  beforeEach(() => {
    elemActionSpy = jasmine.setupSpy('elemAction', ElementActions.prototype);
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    sut = new Design(storeSpy, elemActionSpy);
  });

  it('loads and gets the elements', async done => {
    const elements = [];
    elemActionSpy.loadElements.and.callFake(() => {
      expect(storeSpy.getState.calls.count()).toEqual(0);  
      return Promise.resolve();
    });

    storeSpy.getState.and.returnValue({ elements });

    await sut.activate({ form: 'a' });

    expect(elemActionSpy.loadElements).toHaveBeenCalledWith('a');
    expect(sut.elements).toBe(elements);
    done();
  });
});
