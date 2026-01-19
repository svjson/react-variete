export const SETTING_DEFINITION: unique symbol = Symbol('SettingDefinition')
export const SETTING_VALUE: unique symbol = Symbol('SettingValue')

export type SettingValueType = 'string' | 'boolean' | 'number' | 'enum'

/**
 * Defines the structure of configuration nodes, which can be either setting
 * definitions or nested configuration trees.
 */
export type ConfigNode = SettingDefinition<any> | ConfigTree

/**
 * Defines a configuration setting with optional metadata such as whether it is
 * required, its default value, description, and additional metadata.
 *
 * The setting type (T) and the setting value type (V) are the same for
 * primitives, but V becomes crucial for enum types where the full type of
 * setting (the string tuple/array of valid values) must be bound to T, while
 * V must be assignable from any of T's values.
 *
 * @param T - The full type of the setting
 * @param V - The type of the setting value
 */
export type SettingDefinition<T = any, V = T> = (
  | { type: 'string' }
  | { type: 'number' }
  | { type: 'boolean' }
  | { type: 'enum'; readonly values: T }
) & {
  /**
   * Discriminating branding
   */
  readonly [SETTING_DEFINITION]: true

  /**
   * The name of the configuration setting
   */
  name: string

  /**
   * The default value for the setting, if any
   */
  default?: V

  /**
   * Indicates whether the setting is required
   *
   * @default false
   */
  required?: boolean

  /**
   * A brief description of the setting
   */
  description?: string

  /**
   * Additional arbitrary metadata for the setting
   */
  meta?: Record<string, unknown>
}

/**
 * Defines a tree structure for configuration, where each key maps to either a
 * setting definition or another nested configuration tree.
 */
export type ConfigTree = {
  /**
   * Discriminator
   */
  readonly [SETTING_DEFINITION]?: never
  /**
   * Configuration nodes of this level of the tree.
   */
  [key: string]: ConfigNode
}

/**
 * Type-utility used in inferring whether a setting is required in the
 * configuration literal type.
 *
 * @param S - The setting definition to evaluate
 *
 * @returns True if the setting is required and has no default value, false otherwise
 */
export type IsRequiredSetting<S> = S extends { required: true }
  ? S extends { default: any }
    ? false
    : true
  : false

/**
 * Type-utility that determines if the input configuration literal type allows
 * omission of settings.
 *
 * @param T - The configuration schema tree
 *
 * @returns True if the input configuration can be omitted, false otherwise
 */
export type IsInputOptional<T> =
  HasRequiredWithoutDefault<T> extends true ? false : true

/**
 * Type-utility that checks if there are any required settings without default
 * values in the configuration schema tree.
 *
 * @param T - The configuration schema tree
 *
 * @returns True if there are required settings without default values, false
 *          otherwise
 */
type HasRequiredWithoutDefault<T> =
  T extends SettingDefinition<any>
    ? IsRequiredSetting<T>
    : T extends ConfigTree
      ? true extends {
          [K in keyof T]: HasRequiredWithoutDefault<T[K]>
        }[keyof T]
        ? true
        : false
      : false
/**
 * Type-utility that rounds up all required keys of a ConfigTree branch,
 * checking with full depth if any descendant leaf contains required settings
 * that do not provide default values.
 *
 * @param T - The configuration schema tree
 */
type RequiredKeys<T extends ConfigTree> = {
  [K in keyof T]: T[K] extends SettingDefinition<any>
    ? IsRequiredSetting<T[K]> extends true
      ? K
      : never
    : HasRequiredWithoutDefault<T[K]> extends true
      ? K
      : never
}[keyof T]

/**
 * The inverse of `RequiredKeys` - rounds up all keys that may be safely
 * omitted from a ConfigTree.
 *
 * @param T - The configuration schema tree
 */
type OptionalKeys<T extends ConfigTree> = Exclude<keyof T, RequiredKeys<T>>

export type LiteralValue<V> =
  V extends SettingDefinition<infer S>
    ? S
    : V extends ConfigTree
      ? ConfigLiteral<V>
      : never

/**
 * Derives the literal configuration shape from a configuration schema tree.
 *
 * This is the type of acceptable config inputs from which a concrete
 * configuration object can be materialized. In particular, this type
 * allows omission of required settings that the configuration schema provides
 * default values for.
 *
 * @param T - The configuration schema tree
 */
export type ConfigLiteral<T> = T extends SettingDefinition
  ? never
  : T extends ConfigTree
    ? { [K in RequiredKeys<T>]: LiteralValue<T[K]> } & {
        [K in OptionalKeys<T>]?: LiteralValue<T[K]>
      }
    : never

/**
 * Defines the concrete configuration type derived from a configuration schema
 * tree.
 */
export type ConcreteConfig<T> =
  T extends SettingDefinition<infer V>
    ? V
    : T extends ConfigTree
      ? { [K in keyof T]: ConcreteConfig<T[K]> }
      : never

/**
 * Defines a sparse, partial version of a configuration schema
 * where all settings are recursively optional.
 */
export type PartialConfig<T> =
  T extends SettingDefinition<infer V>
    ? V | undefined
    : T extends ConfigTree
      ? {
          [K in keyof T]?: PartialConfig<T[K]>
        }
      : never

/**
 * Query if a ConfigNode is a SettingDefinition
 *
 * @param node - The configuration node to check
 */
export const isSettingNode = (
  node: ConfigNode
): node is SettingDefinition<any> => {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as any)[SETTING_DEFINITION] === true
  )
}

/**
 * Query if a ConfigNode is a ConfigTree (setting group)
 *
 * @param node - the configuration node to check
 */
export const isGroupNode = (node: ConfigNode): node is ConfigTree => {
  return !isSettingNode(node)
}

/**
 * Query if `value` is valid as a value for `setting`.
 *
 * @param setting - The setting definition
 * @param value - The value to validate
 *
 * @returns True if the value is valid for the setting, false otherwise
 */
export const isValidSettingValue = <S extends SettingDefinition>(
  setting: S,
  value: unknown
): boolean => {
  switch (setting.type) {
    case 'string':
      return typeof value === 'string'

    case 'number':
      return typeof value === 'number' && !Number.isNaN(value)

    case 'boolean':
      return typeof value === 'boolean'

    case 'enum':
      return setting.values.includes(value as string) ?? false

    default:
      return false
  }
}
