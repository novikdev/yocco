/**
 *  Type safe helpers for value definition checking
 *
 * for more info see
 *      https://github.com/microsoft/TypeScript/issues/16069#issuecomment-565658443
 *      https://github.com/robertmassaioli/ts-is-present
 */

/**
 * Type safe argument checking that it is not undefined and null
 */
// tslint:disable-next-line:max-union-size
export function isPresent<T>(t: T | undefined | null | void): t is T {
  return t !== undefined && t !== null;
}

/**
 * Type safe argument checking that it is not undefined
 */
export function isDefined<T>(t: T | undefined): t is T {
  return t !== undefined;
}

/**
 * Type safe argument checking that it is not null
 */
export function isFilled<T>(t: T | null): t is T {
  return t !== null;
}
