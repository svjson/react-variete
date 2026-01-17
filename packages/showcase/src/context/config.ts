import createConfig, { setting } from 'react-variete'

const schema = {
  demo: {
    title: setting({
      name: 'Welcome Message',
      default: 'Welcome to electric smock therapy!',
    }),
  },
}

export const { Provider: ConfigProvider, useConfig } = createConfig(schema)
