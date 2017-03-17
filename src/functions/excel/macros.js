import { HttpClient } from 'aurelia-fetch-client';
import { NewInstance, inject } from 'aurelia-framework';
import { Parser } from 'hot-formula-parser';

export const MACROS = [
  'LOOKUP'
];

@inject(NewInstance.of(HttpClient), Parser)
export class Lookup {

  constructor(http, parser) {
    http.configure(config => config.useStandardConfiguration());

    this._http = http;
    this._parser = parser;
  }

  // TODO - use cache
  /**
   * @summary evaluates the lookup macro into a VLOOKUP
   * @param {Object} lookupObj the object to lookup. It must be a single property
   * { key: value} object where the key is the property to lookup and the value
   * is the value to lookup
   * @param {String} returnName the property name value to return
   */
  async transform(lookupObj, returnName) {
    const lookupKey = Object.keys(lookupObj)[0];
    const lookupVal = lookupObj[lookupKey];

    const metadata = await this._http.fetch(`lookups/${lookupKey}`);
    const obj = await this._http.fetch(`${metadata.api}/${lookupVal}`);

    const row = [];
    const tableName = `${lookupKey}table`;
    const table = this._parser.getVariable(tableName) || [];

    let index = 0;
    let i = 0;
    for (let prop in obj) {
      if (prop === returnName) index = i;
      row.push(obj[prop]);
      i++;
    }

    table.push(row);
    this._parser.setVariable(tableName, table);

    return `VLOOKUP(${lookupVal}, ${tableName}, ${index}, true)`;
  }
}
