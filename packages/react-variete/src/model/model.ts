export const SETTING_DEFINITION: unique symbol = Symbol('SettingDefinition')

/**
 * Defines the structure of configuration nodes, which can be either setting
 * definitions or nested configuration trees.
 */
export type ConfigNode = SettingDefinition<any> | ConfigTree

/**
 * Defines a configuration setting with optional metadata such as whether it is
 * required, its default value, description, and additional metadata.
 *
 * @param T - The type of the setting's value
 */
export type SettingDefinition<T> = {
  /**
   * Discriminating branding
   */
  readonly [SETTING_DEFINITION]: true
  /**
   * The name of the configuration setting
   */
  name: string
  /**
   * Indicates whether the setting is required
   *
   * @default false
   */
  required?: boolean
  /**
   * The default value for the setting, if any
   */
  default?: T
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
type IsRequiredSetting<S> = S extends { required: true }
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
      ? {
          [K in keyof T]: HasRequiredWithoutDefault<T[K]>
        }[keyof T] extends true
        ? true
        : false
      : false

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
export type ConfigLiteral<T> =
  T extends SettingDefinition<any>
    ? never // settings don't appear directly at root
    : T extends ConfigTree
      ? {
          [K in keyof T as T[K] extends SettingDefinition<any>
            ? IsRequiredSetting<T[K]> extends true
              ? K
              : never
            : K]: T[K] extends SettingDefinition<infer V>
            ? V
            : ConfigLiteral<T[K]>
        } & {
          [K in keyof T as T[K] extends SettingDefinition<any>
            ? IsRequiredSetting<T[K]> extends true
              ? never
              : K
            : never]?: T[K] extends SettingDefinition<infer V> ? V : never
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
