import { booleanSetting, enumSetting } from '@/define'
import type { PartialConfig } from '@/model'

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

export const _emptyObject: PartialConfig<typeof TEST_SCHEMA> = {}

export const _nestedEmptyObject: PartialConfig<typeof TEST_SCHEMA> = {
  interface: {},
}

export const _nestedPartialObject: PartialConfig<typeof TEST_SCHEMA> = {
  interface: {
    darkMode: true,
  },
}

export const _nestedUndefinedRequiredValue: PartialConfig<typeof TEST_SCHEMA> =
  {
    interface: {
      darkMode: undefined,
    },
  }

export const _nestedForeignEmptyObject: PartialConfig<typeof TEST_SCHEMA> = {
  // @ts-expect-error
  notvalid: {},
}

export const _nestedForeignSettingKey: PartialConfig<typeof TEST_SCHEMA> = {
  interface: {
    // @ts-expect-error
    notvalid: true,
  },
}

// FIXME: This should work. PartialConfig doesn't resolve the actual configuration
// schema as a partial, but rather just sets everything to unknown / anything goes.
export const _nestedInvalidSettingValue: PartialConfig<typeof TEST_SCHEMA> = {
  interface: {
    // @ts-expect-error
    darkMode: 'Bazinga!',
  },
}
