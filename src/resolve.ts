import { readPath } from '@whimbrel/walk'
import type { ConcreteConfig, ConfigTree } from './model/model'

/**
 * Generate all possible configuration paths for a given configuration object type.
 */
export type ConfigPath<T> = T extends object
  ? {
      [K in keyof T & string]: K | `${K}.${ConfigPath<T[K]>}`
    }[keyof T & string]
  : never

/**
 * Infer the type of a nested value in a configuration object
 *
 * @param T - The configuration object type
 * @param P - The configuration path string
 *
 * @returns The type of the value at the specified configuration path
 */
export type ConfigPathValue<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? ConfigPathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never

/**
 * Resolve a configuration path to its corresponding value in the configuration object.
 *
 * @param config - The configuration object
 * @param path - The configuration path string
 *
 * @returns The value at the specified configuration path
 */
export const resolveConfigPath = <
  Schema extends ConfigTree,
  Config extends ConcreteConfig<Schema>,
  P extends ConfigPath<Config>,
>(
  config: Config,
  path: P
): ConfigPathValue<Config, P> => {
  return readPath(config, path)
}
