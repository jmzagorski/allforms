import './setup';
import { ElementActions } from '../../src/domain/index';
import * as selectors from '../../src/domain/element/element-selectors';
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

  it('loads the elements', async done => {
    await sut.activate({ form: 'a' });

    expect(elemActionSpy.loadElements).toHaveBeenCalledWith('a');
    done();
  });

  it('gets the elements', () => {
    const expectElements = [];
    const getElemsSpy = spyOn(selectors, 'getElements');

    storeSpy.getState.and.returnValue(expectElements);
    getElemsSpy.and.returnValue(expectElements)

    const actualElements = sut.elements;

    expect(getElemsSpy.calls.argsFor(0)[0]).toBe(expectElements)
    expect(actualElements).toBe(expectElements);
  });
});
