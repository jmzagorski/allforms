import { BindingMiddleware } from '../../src/binding-middleware';
import { BindingSignaler } from 'aurelia-templating-resources';
import { setupSpy } from './jasmine-helpers';

describe('the binding signal middleware', () => {
  let sut;
  let signalerSpy;

  beforeEach(() => {
    signalerSpy = setupSpy('signaler', BindingSignaler.prototype);
    sut = new BindingMiddleware(signalerSpy);
  });

  [ { },
    { meta: undefined },
    { meta: null },
    { meta: { } },
    { meta: { isSignal: false } },
    { meta: { isSignal: undefined } },
  ].forEach(action => {
    it('does not signal when no meta signal exists', () => {
      const next = () => {};

      sut.listen(null)(next)(action);

      expect(signalerSpy.signal).not.toHaveBeenCalled();
    });
  });

  it('does signals when meta signal exists', () => {
    const next = () => {};
    const action = { meta: { isSignal: true }, type: 'a' };

    sut.listen(null)(next)(action);

    expect(signalerSpy.signal).toHaveBeenCalledWith(action.type);
  });
});
