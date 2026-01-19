import { stringSetting } from '@/define'
import type { LiteralValue, SettingDefinition } from '@/model'

export const stringDirectlyFromType: LiteralValue<SettingDefinition<string>> =
  'string'

export const stringDefinition = stringSetting({
  name: 'A string setting',
})

export const stringFromDefineSetting: LiteralValue<typeof stringDefinition> =
  'string'
