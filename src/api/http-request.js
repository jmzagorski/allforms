/**
 * @summary sends and receives requests using an XMLHttpRequest interface
 */
export class HttpRequest {

  constructor(httpRequestProvider) {
    this._provider = httpRequestProvider;
  }

  async send(method, api, data) {
    const xhr = this._provider();
    xhr.open(method, api);
    await xhr.send(data);
    return xhr.response;
  }
}
