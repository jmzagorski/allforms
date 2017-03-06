import * as schemas from '../schemas/global';

/**
 * @summary creates the default values object for each element per their schemas
 * @requires module:../schemas/global
 * @return {Object} and object repsenting each schema's default value
 * @example
 * // returns { alert: { type: 'danger', text: 'An Alert!' } }
 * import createDefaults from './defaults';
 * createDefaults();
 *
 */
export default function(name) {
  const defaults = {};

  const schema = schemas[name];

  if (!schema) throw new Error(`Cannot find element schema ${name}`);

  for (let opt of schema) {
    defaults[opt.key] = opt.default;
  }

  return defaults;
}
