import React, { createContext, useContext, useState } from 'react'
import type { ConcreteConfig, ConfigLiteral, ConfigTree } from '@/model'
import { materialize } from '@/materialize'
import type { ConfigPath, ConfigPathValue } from '@/resolve'
import { resolveConfigPath } from '@/resolve'
import { writePath } from '@whimbrel/walk'
import type { PersistentStore } from '@/store/persistent-store'
import { nullStore } from '@/store/null-store'
import { localStorageStore } from '@/store/local-storage'
import { applyStoredConfig } from '@/merge'

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
  type MutateSetting = <P extends ConfigPath<ResolvedConfig>>(
    path: P,
    value: ConfigPathValue<ResolvedConfig, P>
  ) => void

  type ContextState = {
    config: ResolvedConfig
    mutateSetting: MutateSetting
  }

  const ConfigContext = createContext<ContextState | undefined>(undefined)

  /**
   * Defines and provides a ConfigContext React element, which must wrap
   * any part of the React application that should have access to the
   * useConfig-hook.
   */
  function Provider({
    config,
    store,
    children,
  }: {
    config?: ConfigValues
    store?: PersistentStore<ConfigSchema> | 'local-storage'
    children: React.ReactNode
  }) {
    const [currentConfig, setCurrentConfig] = useState(() =>
      config === undefined ? materialize(schema) : materialize(schema, config)
    )

    if (store === 'local-storage') store = localStorageStore('variete')
    if (!store) store = nullStore()

    const mutateSetting: MutateSetting = (path, value) => {
      const clone = structuredClone(currentConfig)
      writePath(clone, path, value)
      store.saveValue(path, value)
      setCurrentConfig(clone)
    }

    const storedConfig = store.load()
    if (storedConfig) {
      applyStoredConfig(schema, currentConfig, storedConfig)
    }

    return (
      <ConfigContext.Provider
        value={{
          config: currentConfig,
          mutateSetting: mutateSetting,
        }}
      >
        {children}
      </ConfigContext.Provider>
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

    const { config } = ctx

    if (!path) {
      return config
    }

    return resolveConfigPath(config, path)
  }

  /**
   * Hook that provides a function to mutate a path within the the current
   * configuration.
   */
  function useConfigMutation(): MutateSetting {
    const ctx = useContext(ConfigContext)
    if (ctx === undefined) {
      throw new Error('useConfigMutation must be used within a ConfigProvider')
    }

    return ctx.mutateSetting
  }

  return {
    Provider,
    useConfigMutation,
    useConfig,
  }
}
