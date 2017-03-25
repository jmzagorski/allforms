import InitialState from '../../../src/config/initial-state';
import { Store } from 'aurelia-redux-plugin';
import { EventAggregator } from 'aurelia-event-aggregator';
import { requestForm, MemberActions } from '../../../src/domain/index';
import { setupSpy } from '../jasmine-helpers';

describe('the initial state configuration', () => {
  let sut;
  let memberSpy;
  let eaSpy;
  let storeSpy;

  beforeEach(() => {
    storeSpy = setupSpy('storeSpy', Store.prototype);
    eaSpy = setupSpy('eventAggr', EventAggregator.prototype);
    memberSpy = setupSpy('member', MemberActions.prototype);
    sut = new InitialState(storeSpy, memberSpy, eaSpy);
  });

  it('loads the initial data from the actions', async done => {
    await sut.configure();

    expect(memberSpy.loadMember.calls.count()).toEqual(1);
    done();
  });

  it('subscribes to the router processing event', async done => {
    await sut.configure();

    expect(eaSpy.subscribe.calls.count()).toEqual(1);
    expect(eaSpy.subscribe.calls.argsFor(0)[0]).toEqual('router:navigation:processing');
    done();
  });

  [ '/formname', '/formname/anything' ].forEach(fragment => {
    it('handles the route processing event', async done => {
      const event = {
        instruction: { fragment  }
      };

      eaSpy.subscribe.and.callFake((name, handler) => {
        handler(event);
        return {};
      });

      await sut.configure();

      expect(storeSpy.dispatch.calls.count()).toEqual(1);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(requestForm('formname'));
      done();
    });
  });

  it('does not handle the route processing event', async done => {
    const event = {
      instruction: { fragment: '/'  }
    };

    eaSpy.subscribe.and.callFake((name, handler) => {
      handler(event);
      return {};
    });

    await sut.configure();

    expect(storeSpy.dispatch).not.toHaveBeenCalled();
    done();
  })
});
