import createConfig, {
  stringSetting,
  enumSetting,
  booleanSetting,
} from 'react-variete'

export const schema = {
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
        groups: enumSetting({
          name: 'Group Renderer',
          default: 'fieldset',
          values: ['fieldset', 'heading'],
        }),
        fields: enumSetting({
          name: 'Field Renderer',
          default: 'stacked',
          values: ['stacked', 'column'],
        }),
      },
    },
  },
}

export const {
  Provider: ConfigProvider,
  useConfig,
  useConfigMutation,
} = createConfig(schema)
