import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import createConfig, { booleanSetting, enumSetting } from '@/index'

describe('ConfigurationContext', () => {
  const STORE_KEY = 'variete'

  beforeEach(() => {
    localStorage.removeItem(STORE_KEY)
  })

  describe('with LocalStorageStore', () => {
    const TEST_SCHEMA = {
      interface: {
        hints: enumSetting({
          name: 'Hints',
          default: 'on',
          values: ['on', 'off'],
          description: 'Show hints',
        }),
        darkMode: booleanSetting({
          name: 'Dark Mode',
          default: false,
          description: 'Enable Dark Mode',
        }),
      },
    }
    const DEFAULT_CONCRETE_CONFIG = {
      interface: {
        hints: 'on',
        darkMode: false,
      },
    }

    describe('on context initialization', () => {
      it('should initialize config according to schema defaults when no stored config exists', () => {
        // Given
        const { useConfig, Provider } = createConfig(TEST_SCHEMA)
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <Provider store="local-storage">{children}</Provider>
        )

        // When
        const { result } = renderHook(() => useConfig(), { wrapper })

        // Then
        expect(result.current).toEqual(DEFAULT_CONCRETE_CONFIG)
      })

      it('should initialize config according to schema defaults when stored config is empty object', () => {
        // Given
        localStorage.setItem(STORE_KEY, '{}')
        const { useConfig, Provider } = createConfig(TEST_SCHEMA)
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <Provider store="local-storage">{children}</Provider>
        )

        // When
        const { result } = renderHook(() => useConfig(), { wrapper })

        // Then
        expect(result.current).toEqual(DEFAULT_CONCRETE_CONFIG)
      })

      it('should initialize config as schema default with a single value overridden from storage', () => {
        // Given
        localStorage.setItem(STORE_KEY, '{ "interface": { "darkMode": true } }')
        const { useConfig, Provider } = createConfig(TEST_SCHEMA)
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <Provider store="local-storage">{children}</Provider>
        )

        // When
        const { result } = renderHook(() => useConfig(), { wrapper })

        // Then
        expect(result.current).toEqual({
          interface: {
            hints: 'on',
            darkMode: true,
          },
        })
      })

      it('should initialize config with fully overwritten defaults ', () => {
        // Given
        localStorage.setItem(
          STORE_KEY,
          '{ "interface": { "hints": "off", "darkMode": true } }'
        )
        const { useConfig, Provider } = createConfig(TEST_SCHEMA)
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <Provider store="local-storage">{children}</Provider>
        )

        // When
        const { result } = renderHook(() => useConfig(), { wrapper })

        // Then
        expect(result.current).toEqual({
          interface: {
            hints: 'off',
            darkMode: true,
          },
        })
      })

      it('should initialize config and ignore settings not defined by schema.', () => {
        // Given
        localStorage.setItem(
          STORE_KEY,
          '{ "interface": { "bouillabaisse": "served lukewarm", "darkMode": true } }'
        )
        const { useConfig, Provider } = createConfig(TEST_SCHEMA)
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <Provider store="local-storage">{children}</Provider>
        )

        // When
        const { result } = renderHook(() => useConfig(), { wrapper })

        // Then
        expect(result.current).toEqual({
          interface: {
            hints: 'on',
            darkMode: true,
          },
        })
      })

      it('should initialize config and ignore settings with invalid values', () => {
        // Given
        localStorage.setItem(
          STORE_KEY,
          '{ "interface": { "hints": "sometimes", "darkMode": true } }'
        )
        const { useConfig, Provider } = createConfig(TEST_SCHEMA)
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <Provider store="local-storage">{children}</Provider>
        )

        // When
        const { result } = renderHook(() => useConfig(), { wrapper })

        // Then
        expect(result.current).toEqual({
          interface: {
            hints: 'on',
            darkMode: true,
          },
        })
      })
    })

    describe('On config mutation', () => {
      it('should create a stored config when none exists', () => {
        // Given
        const { useConfig, useConfigMutation, Provider } =
          createConfig(TEST_SCHEMA)

        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <Provider store="local-storage">{children}</Provider>
        )

        const { result } = renderHook(
          () => ({
            config: useConfig(),
            mutate: useConfigMutation(),
          }),
          { wrapper }
        )

        // When
        act(() => {
          result.current.mutate('interface.hints', 'off')
        })

        // Then
        expect(result.current.config.interface.hints).toBe('off')
        expect(localStorage.getItem(STORE_KEY)).toEqual(
          '{"interface":{"hints":"off"}}'
        )
      })
    })
  })
})
