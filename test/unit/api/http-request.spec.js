import { HttpRequest } from '../../../src/api/http-request';

describe('the http request api', () => {
  it('sends the request', async done => {
    const wrapperSpy = {
      open: jasmine.createSpy('open'),
      send: jasmine.createSpy('send'),
      response: 'c'
    };
    const providerSpy = jasmine.createSpy('provider').and.returnValue(wrapperSpy);
    const sut = new HttpRequest(providerSpy);
    const data = {};

    const response = await sut.send('a', 'b', data);

    expect(wrapperSpy.open).toHaveBeenCalledWith('a', 'b');
    expect(wrapperSpy.send).toHaveBeenCalledWith(data);
    expect(response).toEqual('c');
    done();
  });
});
