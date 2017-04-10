import { importFetch } from '../../../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

export class Lookup {

  constructor(http, defaultApi) {
    this._http = http;
    this._api = defaultApi;
  }

  async run(parser, formula) {
    const variableNames = parser.getVariables(formula) || [];
    const values = parser.getValues(formula) || [];
    const cachedName = `LOOKUP${variableNames.join('')}${values.join('')}`;
    const cached = parser.getVariableValue(cachedName);

    if (cached) return cached;

    //const variableNames = parser.getVariables(formula);
    //const values = parser.getValues(formula) || [];

    const lookupKey = variableNames[0];
    const lookupVal = parser.getVariableValue(lookupKey);
    const returnName = variableNames[1];
    this._api = values[0] || this._api;

    const data = await this._http.fetch(`${this._api}${lookupKey}`)
      .then(response => response.json());

    const row = [];
    const tableVarName = 'table' + cachedName;
    // cache the calls in a table with each call equal to a row
    const table = parser.getVariableValue(tableVarName) || [];

    let index = 0;
    let i = 0;
    for (let prop in data) {
      if (prop === returnName) index = i;
      row.push(data[prop]);
      i++;
    }

    table.push(row);
    parser.setVariable(tableVarName, table);

    const newFormula = `VLOOKUP(${lookupVal}, ${tableVarName}, ${index}, true)`;

    parser.setVariable(cachedName, newFormula);

    return newFormula;
  }
}
