import InitialState from '../../../src/config/initial-state';
import * as formActions from '../../../src/domain/form/form-actions';
import { Store } from 'aurelia-redux-plugin';
import { EventAggregator } from 'aurelia-event-aggregator';
import {
  MemberActions,
  FormActions
} from '../../../src/domain/index';
import using from 'jasmine-data-provider';

describe('the initial state configuration', () => {
  let sut;
  let memberSpy;
  let formSpy;
  let eaSpy;
  let storeSpy;

  beforeEach(() => {
    storeSpy = setupSpy('storeSpy', Store.prototype);
    eaSpy = setupSpy('eventAggr', EventAggregator.prototype);
    memberSpy = setupSpy('member', MemberActions.prototype);
    formSpy = setupSpy('form', FormActions.prototype);
    sut = new InitialState(storeSpy, memberSpy, formSpy, eaSpy);
  });

  it('loads the initial data from the actions', async done => {
    await sut.configure();

    expect(memberSpy.loadMember.calls.count()).toEqual(1);
    expect(formSpy.loadForms.calls.count()).toEqual(1);
    done();
  });

  it('subscribes to the router processing event', async done => {
    await sut.configure();

    expect(eaSpy.subscribe.calls.count()).toEqual(1);
    expect(eaSpy.subscribe.calls.argsFor(0)[0]).toEqual('router:navigation:processing');
    done();
  });

  using([ '/formname', '/formname/anything' ], fragment => {
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
      expect(storeSpy.dispatch).toHaveBeenCalledWith({
        type: 'ACTIVATE_FORM_SUCCESS',
        id: 'formname'
      });
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
