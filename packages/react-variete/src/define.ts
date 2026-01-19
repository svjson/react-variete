import { SETTING_DEFINITION } from './model'
import type { SettingDefinition } from './model'

type Input<T, V = T> = Omit<
  SettingDefinition<T, V>,
  typeof SETTING_DEFINITION | 'type'
>

/**
 * Defines a string-setting schema, preserving the schema details in
 * the resulting type.
 *
 * @param def - The setting details
 *
 * @return A fully formed string-setting definition
 */
export const stringSetting = <Setting extends Input<string>>(
  def: Setting
): SettingDefinition<string> & Setting => {
  return {
    [SETTING_DEFINITION]: true,
    type: 'string',
    ...def,
  }
}

/**
 * Defines a boolean-setting schema, preserving the schema details in
 * the resulting type.
 *
 * @param def - The setting details
 *
 * @return A fully formed boolean-setting definition
 */
export const booleanSetting = <Setting extends Input<boolean>>(
  def: Setting
): SettingDefinition<boolean> & Setting => {
  return {
    [SETTING_DEFINITION]: true,
    type: 'boolean',
    ...def,
  }
}

/**
 * Defines a boolean-setting schema, preserving the schema details in
 * the resulting type.
 *
 * @param def - The setting details
 *
 * @return A fully formed number-setting definition
 */
export const numberSetting = <Setting extends Input<number>>(
  def: Setting
): SettingDefinition<number> & Setting => {
  return {
    [SETTING_DEFINITION]: true,
    type: 'number',
    ...def,
  }
}

/**
 * Defines an enum-setting schema, preserving the schema details in
 * the resulting type.
 *
 * @param def - The setting details
 *
 * @return A fully formed enum-setting definition
 */
export const enumSetting = <
  const T extends readonly string[],
  Setting extends Input<T, T[number]> & { values: T } & {
    values: T
  },
>(
  def: Setting
): SettingDefinition<T, T[number]> & Setting => {
  return {
    [SETTING_DEFINITION]: true,
    type: 'enum',
    ...def,
  }
}
