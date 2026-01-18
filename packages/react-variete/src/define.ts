import { SETTING_DEFINITION } from './model'
import type { SettingDefinition } from './model'

type SettingDetails<T> = Omit<SettingDefinition<T>, typeof SETTING_DEFINITION>

/**
 * Convenience factory-function that defines a setting.
 *
 * @param def - The setting details
 *
 * @return A fully formed setting definition
 */
export const setting = <T>(def: SettingDetails<T>): SettingDefinition<T> => {
  return {
    [SETTING_DEFINITION]: true,
    ...def,
  }
}

/**
 * Convenience factory-function that defines a string-setting.
 *
 * @param def - The setting details
 *
 * @return A fully formed string-setting definition
 */
export const stringSetting = (
  def: Omit<SettingDetails<string>, 'type'>
): SettingDefinition<string> => {
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
  def: Omit<SettingDetails<boolean>, 'type'>
): SettingDefinition<boolean> => {
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
  def: Omit<SettingDetails<number>, 'type'>
): SettingDefinition<number> => {
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
  def: Omit<SettingDetails<T[number]>, 'type'> & {
    values: T
  }
): SettingDefinition<T[number]> => {
  return {
    [SETTING_DEFINITION]: true,
    type: 'enum',
    ...def,
  }
}
