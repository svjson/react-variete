import { readPath, walk, writePath } from '@whimbrel/walk'
import {
  isSettingNode,
  isValidSettingValue,
  type ConcreteConfig,
  type ConfigTree,
  type PartialConfig,
} from './model'

/**
 * Apply stored configuration values to a concrete configuration instance.
 *
 * This function walks through the stored configuration and updates the
 * concrete configuration instance with valid values found in the stored
 * configuration.
 *
 * There are no guarantees that that stored data adheres to the configuration
 * schema, so all values found that do not correspond to a setting or its
 * allowed values are ignored.
 *
 * @param schema - The configuration schema tree
 * @param config - The concrete configuration instance to apply values to
 * @param storedConfig - The stored configuration values to apply
 */
export const applyStoredConfig = <Schema extends ConfigTree>(
  schema: Schema,
  config: ConcreteConfig<Schema>,
  storedConfig: PartialConfig<Schema>
) => {
  walk(storedConfig, {
    onEach: ({ path, value }) => {
      const setting = readPath(schema, path)
      if (isSettingNode(setting) && isValidSettingValue(setting, value)) {
        writePath(config, path, value)
      }
    },
  })
}
