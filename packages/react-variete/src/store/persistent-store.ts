import type { ConfigTree, PartialConfig } from '@/model'
import type { ConfigPath, SchemaPathValueType } from '@/resolve'

/**
 * Interface for a persistent store that can load and save configuration values.
 *
 * @template Schema - The configuration schema type.
 * @template ConfigValues - The configuration values type.
 * @template ResolvedSchema - The resolved configuration schema type.
 */
export interface PersistentStore<Schema extends ConfigTree> {
  /**
   * Load the persisted configuration.
   */
  load(): PartialConfig<Schema> | undefined

  /**
   * Save a configuration value at the specified path.
   *
   * @param path - The configuration path to save the value at.
   * @param value - The configuration value to save.
   */
  saveValue<P extends ConfigPath<Schema>>(
    path: P,
    value: SchemaPathValueType<Schema, P>
  ): void

  /**
   * Clear all persisted configuration values.
   */
  clear(): void
}
