import { booleanSetting, enumSetting } from '@/index'

export const boolDefaultTrue = booleanSetting({
  name: 'A truth!',
  default: true,
})

export const boolDefaultTrue_valid: (typeof boolDefaultTrue)['default'] = true
// @ts-expect-error
export const boolDefaultTrue_invalid: (typeof boolDefaultTrue)['default'] = false

export const enumWithDefault = enumSetting({
  name: 'ABC',
  default: 'a',
  values: ['a', 'b', 'c'],
})

export const enumValues_valid: (typeof enumWithDefault)['values'] = [
  'a',
  'b',
  'c',
]

export const enumValues_invalid: (typeof enumWithDefault)['values'] = [
  // @ts-expect-error
  'c',
  // @ts-expect-error
  'd',
  // @ts-expect-error
  'e',
]
