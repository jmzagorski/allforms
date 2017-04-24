import InitialState from '../../../src/config/initial-state';
import { Store } from 'aurelia-redux-plugin';
import { EventAggregator } from 'aurelia-event-aggregator';
import { requestMemberForm, requestCurrentMember } from '../../../src/domain';
import { setupSpy } from '../jasmine-helpers';

describe('the initial state configuration', () => {
  let sut;
  let eaSpy;
  let storeSpy;

  beforeEach(() => {
    storeSpy = setupSpy('storeSpy', Store.prototype);
    eaSpy = setupSpy('eventAggr', EventAggregator.prototype);
    sut = new InitialState(storeSpy, eaSpy);
  });

  it('dispatches an action to get the current member', () => {
    sut.configure();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestCurrentMember());
  });

  it('subscribes to the router processing event', () => {
    sut.configure();

    expect(eaSpy.subscribe.calls.count()).toEqual(1);
    expect(eaSpy.subscribe.calls.argsFor(0)[0]).toEqual('router:navigation:processing');
  });

  it('handles the route processing event', () => {
    const formName = 'a'
    const memberId = 'b'
    const event = {
      instruction: { params: { memberId, formName }  }
    };

    eaSpy.subscribe.and.callFake((name, handler) => {
      handler(event);
      return {};
    });

    sut.configure();

    expect(storeSpy.dispatch.calls.count()).toEqual(2);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestMemberForm('b', 'a'));
  });

  [ {}, { formName: 'a' }, { memberId: 'b' } ].forEach(params => {
    it('does not handle the route processing event', () => {
      const event = {
        instruction: { params  }
      };

      eaSpy.subscribe.and.callFake((name, handler) => {
        handler(event);
        return {};
      });

      sut.configure();

      expect(storeSpy.dispatch.calls.count()).toEqual(1);
    });
  });
});
