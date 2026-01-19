import { describe } from 'vitest'
import { resolveConfigPath } from '@/resolve'
import { booleanSetting } from '@/define'
import type { ConcreteConfig } from '@/model'

const schema = {
  ui: {
    pages: {
      booking: {
        showIcons: booleanSetting({
          name: 'Show Icons',
        }),
      },
    },
  },
}

type TestSchema = typeof schema

const config: ConcreteConfig<TestSchema> = {
  ui: {
    pages: {
      booking: {
        showIcons: true,
      },
    },
  },
} as const

describe('resolveConfigPath() only accepts valid paths', () => {
  resolveConfigPath(schema, config, 'ui.pages.booking.showIcons') // boolean

  // @ts-expect-error
  resolveConfigPath(schema, config, 'ui.pages.booking.nope')

  // @ts-expect-error
  resolveConfigPath(schema, config, 'ui.pages.nope')
})
