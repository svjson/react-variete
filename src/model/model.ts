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
 * Derives the literal configuration shape from a configuration schema tree.
 *
 * @param T - The configuration schema tree
 */
export type ConfigLiteral<T> =
  T extends SettingDefinition<infer V>
    ? V
    : T extends object
      ? { [K in keyof T]: ConfigLiteral<T[K]> }
      : never

/**
 * Defines the concrete configuration type derived from a configuration schema
 * tree.
 */
export type ConcreteConfig<T> = ConfigLiteral<T>

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
