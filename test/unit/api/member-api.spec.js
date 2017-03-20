import { HttpStub } from '../stubs';
import { MemberApi } from '../../../src/api/index';

describe('the member api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new MemberApi(httpStub);
  });

  it('fetches the current member', async done => {
    httpStub.itemStub = {};

    const actualMember = await sut.getCurrent();

    expect(httpStub.url).toEqual('member');
    expect(actualMember).toBe(httpStub.itemStub);
    done();
  });
});
