import { importFetch } from '../../../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

export class Lookup {

  constructor(http, defaultApi) {
    this._http = http;
    this._api = defaultApi;
  }

  // TODO move the caching into the parser
  async run(parser, formula) {
    const variableNames = parser.getVariables(formula) || [];
    const values = parser.getValues(formula) || [];
    // the cacched formula needs to be all the variables and the values to make
    // sure the caller is asking for the same value
    const lookupKey = variableNames[0];
    const lookupVal = parser.getVariableValue(lookupKey);
    const cachedName = 'LOOKUP' + lookupKey + lookupVal + values.join('');
    const cached = parser.getVariableValue(cachedName);

    // Lookup(LookupVar, ReturnVal)

    if (cached) return cached;

    const returnName = variableNames[1];
    this._api = values[0] || this._api;
    // the table variable should be the key and value since the entire record is
    // saved
    const tableVarName = 'table' + cachedName;

    const data = await this._http.fetch(`${this._api}?${lookupKey}=${lookupVal}`)
      .then(response => response.json());

    const row = [lookupVal]; // make sure the lookup val is the zero index
    // cache the calls in a table with each call equal to a row
    const table = parser.getVariableValue(tableVarName) || [];

    let index = 0;
    let i = 0;
    for (let prop in data) {
      if (prop === returnName) index = i;
      row.push(data[prop]);
      i++;
    }

    debugger;
    table.push(row);
    //parser.setVariable(tableVarName, table);
    // FIXME: temporary fix, the last row will be the one we want
    parser.setVariable(tableVarName, table[table.length - 1][index + 1]);

    //const newFormula = `VLOOKUP(${lookupVal}, ${tableVarName}, ${index}, true)`;
    // FIXME: temporary until VLOOKUP is supported
    const newFormula = `CONCATENATE(${tableVarName})`;

    parser.setVariable(cachedName, newFormula);

    debugger;
    return newFormula;
  }
}
