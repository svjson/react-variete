import { describe } from 'vitest'
import {
  booleanSetting,
  enumSetting,
  numberSetting,
  stringSetting,
} from '@/define'
import type { ConfigLiteral } from '@/model'

export const ALL_OPTIONAL_TEST_SCHEMA = {
  demo: {
    title: stringSetting({
      name: 'Settings Panel Title',
      default: 'Settings Panel',
    }),
    interface: {
      appearance: {
        darkMode: booleanSetting({
          name: 'Dark Mode',
          default: false,
        }),
      },
      layout: {
        layout: enumSetting({
          name: 'Layout Type',
          default: 'flat',
          values: ['flat', 'hierarchy'],
        }),
        groups: numberSetting({
          name: 'Group Renderer',
          default: 8,
        }),
      },
    },
  },
}

export const PARTIALLY_OPTIONAL_TEST_SCHEMA = {
  demo: {
    title: stringSetting({
      name: 'Settings Panel Title',
      default: 'Settings Panel',
      required: true,
    }),
    interface: {
      appearance: {
        darkMode: booleanSetting({
          name: 'Dark Mode',
          default: false,
        }),
      },
      layout: {
        layout: enumSetting({
          name: 'Layout Type',
          values: ['flat', 'hierarchy'],
        }),
        groups: numberSetting({
          name: 'Group Renderer',
          default: 8,
        }),
      },
    },
  },
}

describe('All settings are optional', () => {
  type AllOptionalLiteral = ConfigLiteral<typeof ALL_OPTIONAL_TEST_SCHEMA>

  const rootEmpty: AllOptionalLiteral = {}
  const demoEmpty: AllOptionalLiteral = { demo: {} }
  const demoTitleString: AllOptionalLiteral = {
    demo: { title: 'A title!' },
  }
  const demoTitleNumber: AllOptionalLiteral = {
    // @ts-ignore-error: Invalid type - must be string | undefined
    demo: { title: 9999 },
  }

  console.log([rootEmpty, demoEmpty, demoTitleString, demoTitleNumber])
})

describe('All settings are optional', () => {
  type PartiallyOptionalLiteral = ConfigLiteral<
    typeof PARTIALLY_OPTIONAL_TEST_SCHEMA
  >

  const rootEmpty: PartiallyOptionalLiteral = {}
  const demoEmpty: PartiallyOptionalLiteral = { demo: {} }
  const demoTitleString: PartiallyOptionalLiteral = {
    demo: { title: 'A title!' },
  }
  const demoTitleNumber: PartiallyOptionalLiteral = {
    // @ts-ignore-error: Invalid type - must be string | undefined
    demo: { title: 9999 },
  }

  console.log([rootEmpty, demoEmpty, demoTitleString, demoTitleNumber])
})
