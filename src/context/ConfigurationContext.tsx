import React, { createContext, useContext, useMemo } from 'react'
import { ConcreteConfig, ConfigLiteral, ConfigTree } from '@/model/model'
import { materialize } from '@/materialize'

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
    const value = useMemo(() => materialize(schema, config), [config])

    return (
      <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
    )
  }

  /**
   * The useConfig-hook that application components can make use of to
   * access configuration settings.
   */
  function useConfig(): ResolvedConfig {
    const ctx = useContext(ConfigContext)
    if (ctx === undefined) {
      throw new Error('useConfig must be used within a ConfigProvider')
    }
    return ctx
  }

  return {
    Provider,
    useConfig,
  }
}
