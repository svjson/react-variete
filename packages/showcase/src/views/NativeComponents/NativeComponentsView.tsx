import { SettingsPanel } from 'react-variete'
import type { FieldsPreset, GroupsPreset, LayoutPreset } from 'react-variete'
import { useConfig, schema, useConfigMutation } from '@/context/config'

export default function NativeComponentsView() {
  const config = useConfig()
  const { title } = useConfig('demo')
  const { layout, fields, groups } = useConfig('demo.interface.layout')
  const mutateConfig = useConfigMutation()

  return (
    <div>
      <h1>Native inputs</h1>
      <p>This view demonstrates react-variete using plain HTML inputs.</p>

      <SettingsPanel
        header={title}
        schema={schema}
        config={config}
        layout={layout as LayoutPreset}
        fieldRenderer={fields as FieldsPreset}
        groupRenderer={groups as GroupsPreset}
        onSettingChange={mutateConfig}
      />
    </div>
  )
}
