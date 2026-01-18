import React from 'react'
import type {
  ConfigTree,
  ConcreteConfig,
  ConfigNode,
  SettingDefinition,
} from '@/model'
import { isGroupNode, isSettingNode } from '@/model'
import type { ConfigPath, ConfigPathValue } from '@/resolve'
import {
  ColumnFieldRenderer,
  HierarchicalLayout,
  HeadingGroupRenderer,
  FlatLayout,
  FieldSetGroupRenderer,
  StackedFieldRenderer,
} from './layout/index'
import type {
  FieldRenderer,
  GroupRenderer,
  SettingsLayout,
} from './layout/index'

export type LayoutPreset = 'hierarchy' | 'flat'
export type FieldsPreset = 'stacked' | 'column'
export type GroupsPreset = 'fieldset' | 'heading'

type Layout = SettingsLayout | LayoutPreset
type Fields = FieldRenderer | FieldsPreset
type Groups = GroupRenderer | GroupsPreset

type SettingsPanelProps<Schema extends ConfigTree> = {
  header?: React.ReactNode | string
  groupHeaders?: (path: string) => string
  schema: Schema
  config: ConcreteConfig<Schema>
  layout?: Layout
  groupRenderer?: Groups
  fieldRenderer?: Fields
  onSettingChange: OnSettingChange<Schema>
}

const LAYOUTS: Record<LayoutPreset, SettingsLayout> = {
  flat: FlatLayout,
  hierarchy: HierarchicalLayout,
}

const FIELDS: Record<FieldsPreset, FieldRenderer> = {
  stacked: StackedFieldRenderer,
  column: ColumnFieldRenderer,
}

const GROUPS: Record<GroupsPreset, GroupRenderer> = {
  fieldset: FieldSetGroupRenderer,
  heading: HeadingGroupRenderer,
}

type OnSettingChange<Schema extends ConfigTree> = <
  P extends ConfigPath<ConcreteConfig<Schema>>,
>(
  path: P,
  value: ConfigPathValue<ConcreteConfig<Schema>, P>
) => void

type Join<P extends string, K extends string> = P extends '' ? K : `${P}.${K}`

export default function SettingsPanel<Schema extends ConfigTree>({
  header,
  groupHeaders,
  schema,
  config,
  layout = 'flat',
  fieldRenderer = 'stacked',
  groupRenderer = 'fieldset',
  onSettingChange,
}: SettingsPanelProps<Schema>) {
  type Config = ConcreteConfig<Schema>

  if (!groupHeaders) groupHeaders = (path: string) => path

  const layoutBuilder = (typeof layout === 'string' ? LAYOUTS[layout] : layout)(
    {
      translateGroupHeader: groupHeaders,
      renderField:
        typeof fieldRenderer === 'string'
          ? FIELDS[fieldRenderer]
          : fieldRenderer,
      renderGroup:
        typeof groupRenderer === 'string'
          ? GROUPS[groupRenderer]
          : groupRenderer,
    }
  )

  const renderSetting = <
    P extends ConfigPath<Config>,
    V extends ConfigPathValue<Config, P> = ConfigPathValue<Config, P>,
  >(
    node: SettingDefinition<any>,
    value: V,
    path: P,
    onChange: OnSettingChange<Schema>
  ): React.ReactNode => {
    switch (node.type) {
      case 'string':
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(path, e.target.value as V)}
          />
        )
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => onChange(path, e.target.checked as V)}
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) => onChange(path, Number(e.target.value) as V)}
          />
        )
      case 'enum': {
        const values = (node as any as { values: string[] }).values
        return (
          <select
            value={value}
            onChange={(e) => onChange(path, e.target.value as V)}
          >
            {values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        )
      }
    }
    return <div>Invalid Field</div>
  }

  const renderNode = <P extends ConfigPath<Config> | ''>(
    schemaNode: ConfigNode,
    valueNode: any,
    path: P,
    onChange: OnSettingChange<Schema>
  ): void => {
    if (isSettingNode(schemaNode)) {
      layoutBuilder.addField(
        path,
        schemaNode,
        renderSetting(
          schemaNode,
          valueNode,
          path as ConfigPath<Config>,
          onChange
        )
      )
    }

    const joinPath = (currentPath: P, key: string) =>
      (currentPath ? `${path}.${key}` : key) as Join<P, typeof key>

    if (isGroupNode(schemaNode)) {
      layoutBuilder.beginGroup(path, schemaNode)
      Object.entries(schemaNode).forEach(([key, childNode]) =>
        renderNode(
          childNode,
          (valueNode as any)?.[key],
          joinPath(path, key) as unknown as ConfigPath<Config>,
          onChange
        )
      )
      layoutBuilder.endGroup(path, schemaNode)
    }
  }
  const headerNode = header ? (
    typeof header === 'string' ? (
      <h2>{header}</h2>
    ) : (
      header
    )
  ) : undefined

  renderNode(schema, config, '' as const, onSettingChange)

  return (
    <section>
      {headerNode}
      <div className="rv-settings-panel">{layoutBuilder.build()}</div>
    </section>
  )
}
