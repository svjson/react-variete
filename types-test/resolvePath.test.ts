import { resolveConfigPath } from '@/resolve'

const config = {
  ui: {
    pages: {
      booking: {
        showIcons: true,
      },
    },
  },
} as const

resolveConfigPath(config, 'ui.pages.booking.showIcons') // boolean

// @ts-expect-error
resolveConfigPath(config, 'ui.pages.booking.nope')

// @ts-expect-error
resolveConfigPath(config, 'ui.pages.nope')
