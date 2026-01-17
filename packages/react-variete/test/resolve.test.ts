import { describe, expect, it } from 'vitest'
import { resolveConfigPath } from '@/resolve'

describe('resolveConfigPath', () => {
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
    const result = resolveConfigPath(CONFIG, 'ui.components.mediaPlayer')

    expect(result).toEqual({
      autoPlay: true,
      iconSet: 'default',
    })
  })

  it('should resolve a configuration value', () => {
    const result = resolveConfigPath(
      CONFIG,
      'ui.components.mediaPlayer.iconSet'
    )

    expect(result).toEqual('default')
  })
})
