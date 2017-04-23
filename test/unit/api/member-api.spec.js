import { HttpStub } from '../stubs';
import { MemberApi } from '../../../src/api/index';

describe('the member api', () => {
  let sut;
  let httpStub;

  beforeEach(() => {
    httpStub = new HttpStub();
    sut = new MemberApi(httpStub);
  });

  it('fetches a given memeber', async done => {
    const expectedMember = 'a';
    httpStub.itemStub = [];

    const actualMember = await sut.get(expectedMember);

    expect(httpStub.url).toEqual('members/a');
    expect(actualMember).toBe(httpStub.itemStub);
    done();
  });

  it('fetches the current member', async done => {
    httpStub.itemStub = {};

    const actualMember = await sut.getCurrent();

    expect(httpStub.url).toEqual('members/active');
    expect(actualMember).toBe(httpStub.itemStub);
    done();
  });

  it('fetches the forms for a member', async done => {
    httpStub.itemStub = [];

    const forms = await sut.getForms('a');

    expect(httpStub.url).toEqual('members/a/forms');
    expect(forms).toBe(httpStub.itemStub);
    done();
  });
});
