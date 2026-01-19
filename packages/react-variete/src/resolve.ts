import { readPath } from '@whimbrel/walk'
import type { ConcreteConfig, ConfigTree, SettingDefinition } from './model'

/**
 * Generate all possible configuration paths for a given configuration object type.
 */
export type ConfigPath<T> = T extends object
  ? {
      [K in keyof T & string]: K | `${K}.${ConfigPath<T[K]>}`
    }[keyof T & string]
  : never

/**
 * Infer the type of a nested value in a configuration object.
 *
 * This narrows the resulting type to the actual expressed type
 * of the value under the key at P, and cannot be used to infer
 * the full schema value type. For this, see `SchemaPathValueType`.
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
 * Unwrap the setting value type of a SettingDefinition
 *
 * @param S - The setting definition type
 */
type SettingValueType<S> = S extends { type: 'string' }
  ? string
  : S extends { type: 'number' }
    ? number
    : S extends { type: 'boolean' }
      ? boolean
      : S extends { type: 'enum'; values: readonly (infer E)[] }
        ? E
        : never

/**
 * Infer the setting value type of a schema path in schema T.
 *
 * This resolves the type of the setting value at the given path,
 * unwrapping the SettingDefinition to yield the actual value type.
 *
 * @param T - The configuration schema type
 * @param P - The configuration path string
 */
export type SchemaPathValueType<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? SchemaPathValueType<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P] extends SettingDefinition
      ? SettingValueType<T[P]>
      : never
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
  P extends ConfigPath<Schema>,
>(
  _schema: Schema,
  config: ConcreteConfig<Schema>,
  path: P
): ConfigPathValue<Schema, P> => {
  return readPath(config, path)
}
