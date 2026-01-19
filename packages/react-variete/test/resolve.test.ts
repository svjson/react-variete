import { describe, expect, it } from 'vitest'
import { resolveConfigPath } from '@/resolve'
import { booleanSetting, enumSetting } from '@/define'

describe('resolveConfigPath', () => {
  const SCHEMA = {
    ui: {
      components: {
        mediaPlayer: {
          autoPlay: booleanSetting({
            name: 'Auto-play',
          }),
          iconSet: enumSetting({
            name: 'Icon Set',
            values: ['default', 'dapper'],
          }),
        },
      },
    },
  }

  const CONFIG = {
    ui: {
      components: {
        mediaPlayer: {
          autoPlay: true,
          iconSet: 'default',
        },
      },
    },
  }

  it('should resolve a configuration subtree', () => {
    const result = resolveConfigPath(
      SCHEMA,
      CONFIG,
      'ui.components.mediaPlayer'
    )

    expect(result).toEqual({
      autoPlay: true,
      iconSet: 'default',
    })
  })

  it('should resolve a configuration value', () => {
    const result = resolveConfigPath(
      SCHEMA,
      CONFIG,
      'ui.components.mediaPlayer.iconSet'
    )

    expect(result).toEqual('default')
  })
})
