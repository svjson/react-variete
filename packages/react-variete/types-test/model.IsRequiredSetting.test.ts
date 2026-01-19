import { stringSetting } from '@/define'
import type { IsRequiredSetting } from '@/model'

const requiredSetting = stringSetting({
  name: 'Required',
  required: true,
})

export const whatThis: IsRequiredSetting<typeof requiredSetting> = true
