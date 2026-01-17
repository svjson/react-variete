import {
  ConcreteConfig,
  ConfigLiteral,
  ConfigNode,
  ConfigTree,
  isSettingNode,
  SettingDefinition,
} from './model/model'
import { keysOf } from './utility'

/**
 * Resolve a configuration setting, in other words a leaf in the
 * configuration tree.
 *
 * @param path - Current configuration path
 * @param setting - Setting definition
 * @param value - Provided setting value
 *
 * @returns Materialized setting value
 *
 * @throws Error if a required setting is missing and has no default value
 */
const resolveLeaf = (
  path: string[],
  setting: SettingDefinition<any>,
  value: any
) => {
  if (
    setting.required &&
    value === undefined &&
    setting.default === undefined
  ) {
    throw new Error(`No value given for '${path.join('.')}`)
  }

  if (value === undefined && setting.default !== undefined) {
    return setting.default
  }

  return value
}

/**
 * Recursively resolve configuration tree nodes.
 *
 * @param path - Current configuration path
 * @param schema - Configuration schema tree
 * @param input - Partial configuration values
 *
 * @returns Partially or fully materialized configuration instance
 *
 * @throws Error if a required setting is missing and has no default value
 */
const resolveTree = <
  ConfigSchema extends ConfigTree,
  ConfigValues extends ConfigLiteral<ConfigSchema> =
    ConfigLiteral<ConfigSchema>,
  ResolvedConfig extends ConcreteConfig<ConfigSchema> =
    ConcreteConfig<ConfigSchema>,
>(
  path: string[],
  schema: ConfigSchema,
  input?: ConfigValues
): ResolvedConfig => {
  return keysOf(schema).reduce((config: any, key: keyof ConfigSchema) => {
    const subPath = [...path, key as string]
    const node: ConfigNode = schema[key]
    const value =
      input && typeof input === 'object' ? (input as any)[key] : undefined
    if (isSettingNode(node)) {
      config[key] = resolveLeaf(subPath, node, value)
    } else {
      config[key] = resolveTree(subPath, node, value)
    }
    return config
  }, {} as any) as ResolvedConfig
}

/**
 * Materialize provided configuration values from `input` into a fully
 * realized configuration instance according to `schema`.
 *
 * If a required setting is missing and has no default value, an error
 * is thrown.
 *
 * @param schema - Configuration schema tree
 * @param input - Partial configuration values
 *
 * @returns Fully materialized configuration instance
 *
 * @throws Error if a required setting is missing and has no default value
 */
export const materialize = <
  ConfigSchema extends ConfigTree,
  ConfigValues extends ConfigLiteral<ConfigSchema> =
    ConfigLiteral<ConfigSchema>,
  ResolvedConfig extends ConcreteConfig<ConfigSchema> =
    ConcreteConfig<ConfigSchema>,
>(
  schema: ConfigSchema,
  input?: ConfigValues
): ResolvedConfig => {
  return resolveTree([], schema, input)
}
