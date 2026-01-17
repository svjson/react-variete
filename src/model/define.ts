import { SETTING_DEFINITION, SettingDefinition } from './model'

/**
 * Define a setting
 *
 * @param def - Setting definition without the branding property
 *
 * @return Setting definition with the branding property
 */
export const setting = <T>(
  def: Omit<SettingDefinition<T>, typeof SETTING_DEFINITION>
): SettingDefinition<T> => {
  return {
    [SETTING_DEFINITION]: true,
    ...def,
  }
}
