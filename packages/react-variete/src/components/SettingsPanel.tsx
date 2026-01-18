import React from 'react'
import type {
  ConfigTree,
  ConcreteConfig,
  ConfigNode,
  SettingDefinition,
} from '@/model'
import { isSettingNode } from '@/model'
import type { ConfigPath, ConfigPathValue } from '@/resolve'

type SettingsPanelProps<Schema extends ConfigTree> = {
  header?: React.ReactNode | string
  schema: Schema
  config: ConcreteConfig<Schema>
  onSettingChange: OnSettingChange<Schema>
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
  schema,
  config,
  onSettingChange,
}: SettingsPanelProps<Schema>) {
  type Config = ConcreteConfig<Schema>

  const renderSettingValueComponent = <
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
          <select onChange={(e) => onChange(path, e.target.value as V)}>
            {values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        )
      }
    }
    return <div>Invalid type</div>
  }

  const renderSetting = <
    P extends ConfigPath<Config>,
    V extends ConfigPathValue<Config, P> = ConfigPathValue<Config, P>,
  >(
    node: SettingDefinition<any>,
    value: V,
    path: P,
    onChange: OnSettingChange<any>
  ) => {
    console.log(node)
    return (
      <div key={path}>
        <div>
          <strong>{node.name}</strong>
        </div>
        <div>{renderSettingValueComponent(node, value, path, onChange)}</div>
      </div>
    )
  }

  const renderNode = <P extends ConfigPath<Config> | ''>(
    schemaNode: ConfigNode,
    valueNode: any,
    path: P,
    onChange: OnSettingChange<Schema>
  ): React.ReactNode => {
    if (isSettingNode(schemaNode)) {
      return renderSetting(
        schemaNode,
        valueNode,
        path as ConfigPath<Config>,
        onChange
      )
    }

    const joinPath = (currentPath: P, key: string) =>
      (currentPath ? `${path}.${key}` : key) as Join<P, typeof key>

    if (typeof schemaNode === 'object' && schemaNode !== null) {
      return (
        <fieldset key={path || '__root'}>
          <legend>{path ?? 'root'}</legend>
          {Object.entries(schemaNode).map(([key, childNode]) =>
            renderNode(
              childNode,
              (valueNode as any)?.[key],
              joinPath(path, key) as unknown as ConfigPath<Config>,
              onChange
            )
          )}
        </fieldset>
      )
    }

    return null
  }
  const headerNode = header ? (
    typeof header === 'string' ? (
      <h2>{header}</h2>
    ) : (
      header
    )
  ) : undefined

  return (
    <section>
      {headerNode}
      <div className="rv-settings-panel">
        {renderNode(schema, config, '' as const, onSettingChange)}
      </div>
    </section>
  )
}
