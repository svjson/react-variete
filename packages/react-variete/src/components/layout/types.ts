import React from 'react'
import type { ConfigTree, SettingDefinition } from '@/model'

export type GroupRenderer = (props: GroupRenderProps) => React.ReactNode
export type FieldRenderer = (props: FieldRenderProps) => React.ReactNode

export interface NodeRenderer {
  renderField: FieldRenderer
  renderGroup: GroupRenderer
}

export interface SettingsLayoutBuilder {
  beginGroup(path: string, group: ConfigTree): void
  addField(
    path: string,
    setting: SettingDefinition<any>,
    field: React.ReactNode
  ): void
  endGroup(path: string, group: ConfigTree): void
  build(): React.ReactNode
}

export type SettingsLayout = (
  nodeRenderer: NodeRenderer
) => SettingsLayoutBuilder

export interface StackNode {
  children: LayoutNode[]
}

export interface GroupNode {
  type: 'group'
  path: string
  node: ConfigTree
  children: LayoutNode[]
}

export interface FieldNode {
  type: 'field'
  path: string
  node: SettingDefinition<any>
  reactNode: React.ReactNode
}

export type LayoutNode = GroupNode | FieldNode

export interface GroupRenderProps {
  path: string
  group: ConfigTree
  children: React.ReactNode[]
}

export interface FieldRenderProps {
  path: string
  field: SettingDefinition<any>
  reactNode: React.ReactNode
}
