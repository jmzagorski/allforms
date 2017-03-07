import * as schemas from '../schemas/index';

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
export default function(style, name) {
  debugger;
  const defaultStyle = schemas[style];

  if (!defaultStyle) return null;

  const defaults = {};

  const schema = defaultStyle[name];

  if (!schema) return null;

  for (let opt of schema) {
    defaults[opt.key] = opt.default;
  }

  return defaults;
}
