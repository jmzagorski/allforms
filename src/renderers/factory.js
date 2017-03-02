import * as renderers from './index'
import getDefaults from './defaults'

//const defaults = getDefaults();

/**
 * @summary factory function to create supported elements
 * @param {String} style the style category all elements implement. Examples
 * would be bootstrap, semantic, Material design etc.
 * @param {String} type the type of element.
 * @param {Object} options An key/value object with a any number of values. The
 * factory looks for qty, name and required. If not options value is passed,
 * default values are used
 * @example
 * // returns a bootstrap text input
 * create('bootstrap', 'input', { type: 'text' })
 */
export function create(style, type, options = getDefaults(type)) {
  const elems = [];
  const rendererStyle = renderers[style];

  if (!rendererStyle) throw new Error(`Style ${style} is not supported`);

  const styleType = rendererStyle[type];

  if (!styleType) throw new Error(`Style ${style} does not have a ${type} type`);

  for (let i = 0; i < options.qty; i++) {
    const elem = styleType.create(options);

    // set the same name so elements like radios are grouped togther
    _setCommonProps(elem, options);

    elems.push(elem);
  }

  return elems;
}

function _setCommonProps(element, options) {
  element.name = options.name;
  if (options.required) element.required = true;
}
