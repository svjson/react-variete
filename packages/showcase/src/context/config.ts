import createConfig, {
  stringSetting,
  enumSetting,
  booleanSetting,
  numberSetting,
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
        type: enumSetting<['wide', 'narrow', 'columns']>({
          name: 'Layout Type',
          default: 'wide',
          values: ['wide', 'narrow', 'columns'],
        }),
        padding: numberSetting({
          name: 'Padding',
          default: 4,
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
