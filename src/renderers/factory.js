import * as renderers from './index';
import getDefaults from './defaults';

/**
 * @summary factory function to create supported elements
 * @desc this factory functions handle common logic across the specific
 * stylistic functions including setting common properties and checking to make
 * sure the factoruy function exists
 * @param {String} style the style category all elements implement. Examples
 * would be bootstrap, semantic, Material design etc.
 * @param {String} type the type of element.
 * @param {Object} options An key/value object with a any number of values.
 * If no options value is passed, default values are used. The factor does look
 * for certain properties
 * @param {Boolean} options.mandatory sets the required attribute
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

  const $created = $existing ? styleType.update(options, $existing) : styleType.create(options);

  const $input = $created.tagName === 'INPUT' || $created.tagName === 'SELECT' ?
    $created : $created.querySelector('input') || $created.querySelector('select');

  if ($input) {
    $input.id = options.id;
    $input.name = options.name;
    $input.required = options.mandatory;
  }


  return $created;
}
