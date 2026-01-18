import { describe, it, expect } from 'vitest'
import { materialize } from '@/materialize'
import { booleanSetting, enumSetting, stringSetting } from '@/define'

const SCHEMA__SINGLE_TOP_LEVEL__WITH_DEFAULT = {
  settingOne: enumSetting<['on', 'off']>({
    name: 'A setting',
    default: 'on',
    values: ['on', 'off'],
  }),
}

const SCHEMA__SINGLE_TOP_LEVEL__NO_DEFAULT = {
  settingOne: enumSetting<['on', 'off']>({
    name: 'A setting',
    values: ['on', 'off'],
  }),
}

const SCHEMA__SINGLE_TOP_LEVEL__REQUIRED__NO_DEFAULT = {
  settingOne: enumSetting<['on', 'off']>({
    name: 'A setting',
    values: ['on', 'off'],
    required: true,
  }),
}

const SCHEMA__NESTED_TREE__WITH_DEFAULTS = {
  global: {
    testSetting: stringSetting({
      name: 'Test this',
      default: 'yes',
    }),
    darkMode: booleanSetting({
      name: 'Dark Mode',
      default: false,
    }),
  },
  contexts: {
    mediaPlayer: {
      autoPlay: booleanSetting({
        name: 'Autoplay next video',
        default: true,
      }),
      subtitles: enumSetting<['English', 'Swedish', 'Tagalog', 'Spanish']>({
        name: 'Subtitles',
        default: 'English',
        values: ['English', 'Swedish', 'Tagalog', 'Spanish'],
      }),
    },
  },
}

const SCHEMA__NESTED_TREE__REQUIRED_SETTINGS__NO_DEFAULTS = {
  global: {
    testSetting: booleanSetting({
      name: 'Test this',
      required: true,
    }),
    darkMode: booleanSetting({
      name: 'Dark Mode',
    }),
  },
  contexts: {
    mediaPlayer: {
      autoPlay: booleanSetting({
        name: 'Autoplay next video',
        required: true,
      }),
      subtitles: enumSetting<['English', 'Swedish', 'Tagalog', 'Spanish']>({
        name: 'Subtitles',
        values: ['English', 'Swedish', 'Tagalog', 'Spanish'],
      }),
    },
  },
}

const SCHEMA__NESTED_TREE__NO_DEFAULTS = {
  global: {
    testSetting: stringSetting({
      name: 'Test this',
    }),
    darkMode: booleanSetting({
      name: 'Dark Mode',
    }),
  },
  contexts: {
    mediaPlayer: {
      autoPlay: booleanSetting({
        name: 'Autoplay next video',
      }),
      subtitles: enumSetting<['English', 'Swedish', 'Tagalog', 'Spanish']>({
        name: 'Subtitles',
        values: ['English', 'Swedish', 'Tagalog', 'Spanish'],
      }),
    },
  },
}

describe('materialize', () => {
  it.each([
    {
      desc: 'top level setting',
      schema: SCHEMA__SINGLE_TOP_LEVEL__WITH_DEFAULT,
      expected: {
        settingOne: 'on',
      },
    },
    {
      desc: 'nested settings',
      schema: SCHEMA__NESTED_TREE__WITH_DEFAULTS,
      expected: {
        global: {
          testSetting: 'yes',
          darkMode: false,
        },
        contexts: {
          mediaPlayer: {
            autoPlay: true,
            subtitles: 'English',
          },
        },
      },
    },
  ])(
    'should materialize config with $desc from default values',
    ({ schema, expected }) => {
      expect(materialize(schema)).toEqual(expected)
    }
  )

  it.each([
    {
      desc: 'top level setting',
      inputDesc: 'undefined',
      schema: SCHEMA__SINGLE_TOP_LEVEL__REQUIRED__NO_DEFAULT,
      input: undefined,
    },
    {
      desc: 'top level setting',
      inputDesc: 'specified but undefined',
      schema: SCHEMA__SINGLE_TOP_LEVEL__REQUIRED__NO_DEFAULT,
      input: {
        settingOne: undefined,
      },
    },
    {
      desc: 'nested settings',
      inputDesc: 'undefined',
      schema: SCHEMA__NESTED_TREE__REQUIRED_SETTINGS__NO_DEFAULTS,
      input: undefined,
    },
    {
      desc: 'nested settings',
      inputDesc: 'only partially defined',
      schema: SCHEMA__NESTED_TREE__REQUIRED_SETTINGS__NO_DEFAULTS,
      input: {
        contexts: {
          mediaPlayer: {
            autoPlay: true,
          },
        },
      },
    },
  ])(
    'should throw error for config with $desc with $inputDesc input when there is no value for required setting',
    ({ schema, input }) => {
      expect(() => {
        // This is intentionally invalid, and here we are verifying that an error is thrown
        // when the type-system cannot reject it at compile-time, ie in case of JS or dodgy
        // TS usage.
        // @ts-expect-error
        materialize(schema, input)
      }).toThrowError()
    }
  )

  it.each([
    {
      desc: 'nested settings',
      from: 'empty object',
      schema: SCHEMA__NESTED_TREE__WITH_DEFAULTS,
      input: {},
      expected: {
        global: {
          testSetting: 'yes',
          darkMode: false,
        },
        contexts: {
          mediaPlayer: {
            autoPlay: true,
            subtitles: 'English',
          },
        },
      },
    },
  ])(
    'should materialize config with $desc from $from',
    ({ schema, input, expected }) => {
      expect(materialize(schema, input)).toEqual(expected)
    }
  )

  it.each([
    {
      desc: 'top level setting',
      schema: SCHEMA__SINGLE_TOP_LEVEL__NO_DEFAULT,
      input: {
        settingOne: 'off',
      },
      expected: {
        settingOne: 'off',
      },
    },
    {
      desc: 'nested settings',
      schema: SCHEMA__NESTED_TREE__NO_DEFAULTS,
      input: {
        global: {
          testSetting: 'is very set',
          darkMode: true,
        },
        contexts: {
          mediaPlayer: {
            autoPlay: false,
            subtitles: 'Tagalog',
          },
        },
      },
      expected: {
        global: {
          testSetting: 'is very set',
          darkMode: true,
        },
        contexts: {
          mediaPlayer: {
            autoPlay: false,
            subtitles: 'Tagalog',
          },
        },
      },
    },
  ])(
    'should materialize no-defaults config with $desc from provided values',
    ({ schema, input, expected }) => {
      expect(materialize(schema, input)).toEqual(expected)
    }
  )

  it.each([
    {
      desc: 'top level setting',
      schema: SCHEMA__SINGLE_TOP_LEVEL__WITH_DEFAULT,
      input: {
        settingOne: 'off',
      },
      expected: {
        settingOne: 'off',
      },
    },
    {
      desc: 'nested settings',
      schema: SCHEMA__NESTED_TREE__WITH_DEFAULTS,
      input: {
        global: {
          testSetting: 'is very set',
        },
        contexts: {
          mediaPlayer: {
            autoPlay: true,
          },
        },
      },
      expected: {
        global: {
          testSetting: 'is very set',
          darkMode: false,
        },
        contexts: {
          mediaPlayer: {
            autoPlay: true,
            subtitles: 'English',
          },
        },
      },
    },
  ])(
    'should materialize config with $desc and override defaults with input values where provided',
    ({ schema, input, expected }) => {
      expect(materialize(schema, input)).toEqual(expected)
    }
  )

  it.each([
    {
      desc: 'nested settings',
      inputDesc: 'only required settings defined',
      schema: SCHEMA__NESTED_TREE__REQUIRED_SETTINGS__NO_DEFAULTS,
      input: {
        global: {
          testSetting: true,
        },
        contexts: {
          mediaPlayer: {
            autoPlay: false,
          },
        },
      },
      expected: {
        global: {
          testSetting: true,
          darkMode: undefined,
        },
        contexts: {
          mediaPlayer: {
            autoPlay: false,
            subtitles: undefined,
          },
        },
      },
    },
  ])(
    'should materialize config with $desc and no defaults when only required fields are provided',
    ({ schema, input, expected }) => {
      expect(materialize(schema, input)).toEqual(expected)
    }
  )
})
