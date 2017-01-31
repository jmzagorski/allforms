import InitialState from '../../../src/config/initial-state';
import {
  MemberActions,
  FormActions
} from '../../../src/domain/index';

describe('the initial state configuration', () => {
  var sut;
  var memberSpy;
  var formSpy;

  beforeEach(() => {
    memberSpy = jasmine.setupSpy('member', MemberActions.prototype);
    formSpy = jasmine.setupSpy('form', FormActions.prototype);
    sut = new InitialState(memberSpy, formSpy);
  });

  it('loads the initial data from the actions', async done => {
    await sut.configure();

    expect(memberSpy.loadMember.calls.count()).toEqual(1);
    expect(formSpy.loadForms.calls.count()).toEqual(1);
    done();
  });
});
