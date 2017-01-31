import { MemberApi } from '../../../../src/api/member-api';
import { MemberActions } from '../../../../src/domain/index';
import { Store } from 'aurelia-redux-plugin';

describe('the member actions', () => {
  var sut;
  var storeSpy;
  var apiSpy;

  beforeEach(() => {
    storeSpy = jasmine.setupSpy('store', Store.prototype);
    apiSpy = jasmine.setupSpy('api', MemberApi.prototype);
    sut = new MemberActions(apiSpy, storeSpy);
  });

  it('loads the current members', async done => {
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
