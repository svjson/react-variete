/**
 * Type-safe alternative to the regular type-erasing `Object.keys`.
 *
 * @param obj - The object whose keys are to be retrieved.
 *
 * @return An array of the object's keys, typed as an array of the keys of T.
 */
export const keysOf = <T extends object>(obj: T): (keyof T)[] => {
  return typeof obj === 'object' ? (Object.keys(obj) as (keyof T)[]) : []
}
