import { evaluate } from './index'

export const PREFIX = 'xl_';

/**
 * @summary AND(value,value,...values)
 * @desc Evaluates all segments and if one value is false, returns false
 * @param {Array<string>} segments the array of that will be searched
 * @example 
 * // returns false
 * AND(1=1, 2=2, 3=4)
 * AND('', 2=2, 'a')
 * // returns true
 * AND(true, 1)
 */
export function xl_and(segments) {
  return segments.some(s => !s);
}

/**
 * @summary CONCAT(value,value,...values)
 * @desc Joins all segments together
 * @param {Array<any>} segments an array of that will be joined
 * @example
 * // returns 1,2
 * CONCAT(1, ",", 2)
 */
export function xl_concat(segments) {
  return segments.join('') 
}

/**
 * @summary IF(test,, truth=true, falsy=false)
 * @desc Evaluates the first item in the array and evaluates the second item if
 * true or third item if false. Support for leaving out 2nd and 3rd item
 * @param {Array<any>} segments the array of that will be evaluated
 * @example
 * // returns true
 * IF(1=1)
 * // returns 'a'
 * IF(1=1, 'a')
 * // returns false
 * IF(1=2, 'a')
 * // returns 'b'
 * IF(1=2, 'a', 'b')
 */
export function xl_if(segments) {
  if (segments.length === 1) {
    return segments[0] ? true : false;
  } else if (segments.length === 2) {
    return segments[0] ? segments[1] : false;
  }

  return segments[0] ? segments[1] : segments[2];
}

/**
 * @summary IN(lookup, value, value,...values)
 * @desc Searches for the lookup value in the values and returns true if found.
 * This is like an overloaded @see or function
 * @example
 * // return true
 * IN('a', 'a', 'b', 'c')s pc;
 * // returns false
 * IN('a', 'b', 'c', 'd')
 */
export function xl_in(segments) {
  const lookup = segments.splice(0, 1)[0];
  return segments.join().indexOf(lookup) !== -1;
}

/**
 * @summary LOOKUP(lookup, returnvalue, function?).
 * @desc Calls remote api to lookup a value
 * @param {Array<any>} segments an array of values that contains the lookup
 * @example
 * // returns 3 if the api cure time is 3
 * LOOKUP('VA151', CureTime)
 * // returns 'hi' if there is as curetime from the api, else it returns 'bye'
 * LOOKUP('VA151', CureTime, If(CureTime, 'hi', 'bye')))
 */
export function xl_lookup(segments) {
  const lookupKey = segments[1];
  const lookupVal = segments[2].trim();
  const ajax = lookupVal == null ? null : $.ajax({
    cache: true,
    type: 'get',
    url: `${segments[0]}/${lookupKey}/${lookupVal}`
  });

  return ajax;
}

/**
 * @summary MAX(value, value, ...values)
 * @desc Returns the maximum number in the CSV list
 * @param {Array<Number>} segments an array of numbers
 * @return {Number} the maximum number
 * @example
 * // returns 4
 * MAX(1,2,3,4)
 */
export function xl_max(segments) {
  return Math.max.apply(Math, segments);
}

/**
 * @summary MIN(value, value, ...values)
 * @desc Returns the minimum number in the CSV list
 * @param {Array<Number>} segments an array of numbers
 * @return {Number} the minimum number
 * @example
 * // returns 1
 * MAX(1,2,3,4)
 */
export function xl_min(segments) {
  return Math.min.apply(Math, segments);
}

/**
 * @summary NOT(value, value, ...values)
 * @desc Returns false if one value in the CSV list evaluates to true, else true
 * @param {Array} segments an array of values
 * @return {Boolean} true if all values are false
 * @example
 * // returns true
 * NOT(1=2, '', 0, false)
 */
export function xl_not(segments) {
  return !xl_or(segments)
}

/**
 * @summary OR(value,value,...values)
 * @desc Evaluates all CSV values and returns true if any are true
 * @param {Array} segments an array of values
 * @return {Boolean} true if any value is true
 * @example
 * // returns true
 * OR(1=2, 1, 0, false)
 */
export function xl_or(segments) {
  return segments.some(s => s);
}

/**
 * @summary SUM(value1,value2,...valueN) 
 * @desc Returns the sum of the entire CSV list
 * @param {Array<Number>} segments an array of numbers
 * @return {Number} the summation calculation
 * @example
 * // returns 6
 * SUM(1, 2, 3)
 */
export function xl_sum(segments) {
  return segments.reduce((a,b) => a + b);
}
