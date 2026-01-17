import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import createConfig, { setting } from '@/index'

describe('ConfigurationContext', () => {
  describe('useConfig', () => {
    it('should provide the full configuration', () => {
      const { useConfig, Provider } = createConfig({
        global: {
          testSetting: setting({
            name: 'Hints',
            default: 'on',
            description: 'Show hints',
          }),
        },
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider>{children}</Provider>
      )

      const { result } = renderHook(() => useConfig(), { wrapper })

      expect(result.current).toEqual({
        global: {
          testSetting: 'on',
        },
      })
    })
  })

  it('should resolve a single config value by path', () => {
    const { useConfig, Provider } = createConfig({
      global: {
        testSetting: setting({
          name: 'Hints',
          default: 'on',
          description: 'Show hints',
        }),
      },
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider>{children}</Provider>
    )

    const { result } = renderHook(() => useConfig('global.testSetting'), {
      wrapper,
    })

    expect(result.current).toEqual('on')
  })
})
