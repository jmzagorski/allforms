import InitialState from '../../../src/config/initial-state';
import { Store } from 'aurelia-redux-plugin';
import { EventAggregator } from 'aurelia-event-aggregator';
import { requestMemberForm, receivedCurrentMember } from '../../../src/domain';
import { MemberApi } from '../../../src/api';
import { setupSpy } from '../jasmine-helpers';

describe('the initial state configuration', () => {
  let sut;
  let eaSpy;
  let storeSpy;
  let apiSpy;

  beforeEach(() => {
    storeSpy = setupSpy('storeSpy', Store.prototype);
    apiSpy = setupSpy('apiSpy', MemberApi.prototype);
    eaSpy = setupSpy('eventAggr', EventAggregator.prototype);
    sut = new InitialState(storeSpy, eaSpy, apiSpy);
  });

  it('dispatches an action when received the current member', async done => {
    const member = {};
    apiSpy.getCurrent.and.returnValue(member);

    await sut.configure();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(receivedCurrentMember(member));
    done();
  });

  it('subscribes to the router processing event', async done => {
    await sut.configure();

    expect(eaSpy.subscribe.calls.count()).toEqual(1);
    expect(eaSpy.subscribe.calls.argsFor(0)[0]).toEqual('router:navigation:processing');
    done();
  });

  it('handles the route processing event', async done => {
    const formName = 'a'
    const memberId = 'b'
    const event = {
      instruction: { params: { memberId, formName }  }
    };

    eaSpy.subscribe.and.callFake((name, handler) => {
      handler(event);
      return {};
    });

    await sut.configure();

    expect(storeSpy.dispatch.calls.count()).toEqual(2);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(requestMemberForm('b', 'a'));
    done();
  });

  [ {}, { formName: 'a' }, { memberId: 'b' } ].forEach(params => {
    it('does not handle the route processing event', async done => {
      const event = {
        instruction: { params  }
      };

      eaSpy.subscribe.and.callFake((name, handler) => {
        handler(event);
        return {};
      });

      await sut.configure();

      expect(storeSpy.dispatch.calls.count()).toEqual(1);
      done();
    });
  });
});
