import * as renderers from './index'
import getDefaults from './defaults'

/**
 * @summary factory function to create supported elements
 * @param {String} style the style category all elements implement. Examples
 * would be bootstrap, semantic, Material design etc.
 * @param {String} type the type of element.
 * @param {Object} options An key/value object with a any number of values.
 * If no options value is passed, default values are used. The factor does look
 * for certain properties
 * @param {Boolean} options.required sets the required attribute
 * @param {Number} options.id sets the id attribute
 * @param {String} options.name sets the name attribute
 * @param {Element} element an optional element that will be the template for a
 * new style
 * @example
 * // returns a bootstrap text input
 * create('bootstrap', 'input', { type: 'text' })
 */
export function create(style, type, options = getDefaults(type), $existing = null) {
  const rendererStyle = renderers[style];

  if (!rendererStyle) throw new Error(`Style ${style} is not supported`);

  const styleType = rendererStyle[type];

  if (!styleType) throw new Error(`Style ${style} does not have a ${type} type`);

  const $created = $existing ? styleType.update(option, $existings) : styleType.create(options);

  $created.name = options.name;
  $created.id = options.id;

  if (options.required) $created.required = true;

  return $created;
}
