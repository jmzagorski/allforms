import { HttpClient } from 'aurelia-fetch-client';
import { NewInstance } from 'aurelia-framework';
import { Store } from 'aurelia-redux-plugin';
import { getActiveForm } from '../../../domain';
import { Lookup } from './lookup';

export class LookupProvider {

  static inject = [ Store, NewInstance.of(HttpClient) ];

  constructor(store, http) {
    this._store = store;
    this._http = http;
  }

  provide() {
    const form = getActiveForm(this._store.getState());

    // TODO do i configure base url here and do not send the api?
    // then the api wont be configurable within a formula later on
    // if i just use the api from the form then i really don't need this 
    // configuration and i can set the base url to whatever their api is in the
    // form configuration
    this._http.configure(config => config.useStandardConfiguration());

    return new Lookup(this._http, form.api + '/lookups');
  }
}
