import { MemberApi } from '../../../../src/api/member-api';
import { MemberActions } from '../../../../src/domain/index';
import { Store } from '../../../../src/config/store';
import { setupSpy } from '../../jasmine-helpers';

describe('the member actions', () => {
  var sut;
  var storeSpy;
  var apiSpy;

  beforeEach(() => {
    storeSpy = setupSpy('store', Store.prototype);
    apiSpy = setupSpy('api', MemberApi.prototype);
    sut = new MemberActions(apiSpy, storeSpy);
  });

  it('loads the current member', async done => {
    const member = {};

    apiSpy.getCurrent.and.returnValue(member);

    await sut.loadMember();

    expect(storeSpy.dispatch).toHaveBeenCalledWith({
      type: 'LOAD_MEMBER_SUCCESS', member
    });
    expect(storeSpy.dispatch.calls.argsFor(0)[0].member).toBe(member);
    done();
  });
});
