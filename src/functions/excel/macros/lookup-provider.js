import { HttpClient } from 'aurelia-fetch-client';
import { NewInstance } from 'aurelia-framework';
import { Lookup } from './lookup';
import configure from '../../../config/http-client';

export class LookupProvider {

  static inject = [ NewInstance.of(HttpClient), HttpClient ];

  /**
   * @summary default ctor for the lookup provider
   * @param {HttpClient} newHttp a new instance of the http client to be used in
   * the construction of the Lookup object
   * @param {HttpClient} appHttp the exiting http client within the application
   */
  constructor(newHttp, appHttp) {
    this._newHttp = newHttp;
    this._appHttp = appHttp;

    configure(newHttp, '');
  }

  provide() {
    // pass in a new Http so that the URL can be w/e the client wants,
    // but pass in the default url as the app url. makes the lookup API more
    // flexable
    return new Lookup(this._newHttp, this._appHttp.baseUrl + 'lookups');
  }
}
