import { SETTING_DEFINITION } from './model'
import type {
  BooleanSetting,
  EnumSetting,
  NumberSetting,
  SettingDefinitionBase,
  StringSetting,
} from './model'

type SettingDetails<T extends SettingDefinitionBase> = Omit<
  T,
  typeof SETTING_DEFINITION
>

/**
 * Convenience factory-function that defines a string-setting.
 *
 * @param def - The setting details
 *
 * @return A fully formed string-setting definition
 */
export const stringSetting = (
  def: Omit<SettingDetails<StringSetting>, 'type'>
): StringSetting => {
  return {
    [SETTING_DEFINITION]: true,
    type: 'string',
    ...def,
  }
}

/**
 * Convenience factory-function that defines a boolean-setting.
 *
 * @param def - The setting details
 *
 * @return A fully formed boolean-setting definition
 */
export const booleanSetting = (
  def: Omit<SettingDetails<BooleanSetting>, 'type'>
): BooleanSetting => {
  return {
    [SETTING_DEFINITION]: true,
    type: 'boolean',
    ...def,
  }
}

/**
 * Convenience factory-function that defines a number-setting.
 *
 * @param def - The setting details
 *
 * @return A fully formed number-setting definition
 */
export const numberSetting = (
  def: Omit<SettingDetails<NumberSetting>, 'type'>
): NumberSetting => {
  return {
    [SETTING_DEFINITION]: true,
    type: 'number',
    ...def,
  }
}

/**
 * Convenience factory-function that defines a enum-setting.
 *
 * @param def - The setting details
 *
 * @return A fully formed enum-setting definition
 */
export const enumSetting = <T extends readonly string[]>(
  def: Omit<SettingDetails<EnumSetting<T>>, 'type'> & {
    values: T
  }
): EnumSetting<T> => {
  return {
    [SETTING_DEFINITION]: true,
    type: 'enum',
    ...def,
  }
}
