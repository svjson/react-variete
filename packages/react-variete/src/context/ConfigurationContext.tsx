import React, { createContext, useContext, useMemo } from 'react'
import type { ConcreteConfig, ConfigLiteral, ConfigTree } from '@/model/model'
import { materialize } from '@/materialize'
import type { ConfigPath, ConfigPathValue } from '@/resolve'
import { resolveConfigPath } from '@/resolve'

/**
 * Create a configuration context
 *
 * @param schema - The configuratoi schema
 *
 * @template ConfigSchema - The configuration schema type.
 *                          Typically inferred from `schema`.
 * @template ConfigValues - The configuration values type
 *
 * @return A Provider component and a useConfig hook.
 */
export function createConfig<
  ConfigSchema extends ConfigTree,
  ConfigValues extends ConfigLiteral<ConfigSchema> =
    ConfigLiteral<ConfigSchema>,
>(schema: ConfigSchema) {
  type ResolvedConfig = ConcreteConfig<ConfigSchema>

  const ConfigContext = createContext<ResolvedConfig | undefined>(undefined)

  /**
   * Defines and provides a ConfigContext React element, which must wrap
   * any part of the React application that should have access to the
   * useConfig-hook.
   */
  function Provider({
    config,
    children,
  }: {
    config?: ConfigValues
    children: React.ReactNode
  }) {
    const value = useMemo(
      () =>
        config === undefined
          ? materialize(schema)
          : materialize(schema, config),
      [config]
    )

    return (
      <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
    )
  }

  /**
   * Hook that application components can make use of to access the effective
   * configuration.
   *
   * @returns The full configuration object
   */
  function useConfig(): ResolvedConfig
  /**
   * Hook that application components can make use of to access a specific
   * configuration value or sub-level of the effective confguration.
   *
   * @param path - The configuration path to access
   *
   * @returns The configuration value or configuration-sublevel at the
   *          specified path
   */
  function useConfig<P extends ConfigPath<ResolvedConfig>>(
    path: P
  ): ConfigPathValue<ResolvedConfig, P>
  /**
   * Implementation of the useConfig hook overloads.
   */
  function useConfig(path?: ConfigPath<ResolvedConfig>) {
    const ctx = useContext(ConfigContext)
    if (ctx === undefined) {
      throw new Error('useConfig must be used within a ConfigProvider')
    }

    if (!path) {
      return ctx
    }

    return resolveConfigPath(ctx, path)
  }

  return {
    Provider,
    useConfig,
  }
}
