import React from 'react'
import type {
  LayoutNode,
  GroupNode,
  NodeRenderer,
  StackNode,
  SettingsLayoutBuilder,
} from './types'
import type { ConfigTree, SettingDefinition } from '@/model'

export const FlatLayout = (renderer: NodeRenderer): SettingsLayoutBuilder => {
  const rootNode: StackNode = { children: [] }
  const groupStack: StackNode[] = [rootNode]

  return {
    beginGroup(path: string, group: ConfigTree) {
      const node: GroupNode = {
        type: 'group',
        path,
        node: group,
        children: [],
      }
      rootNode.children.push(node)
      groupStack.push(node)
    },
    addField(
      path: string,
      setting: SettingDefinition<any>,
      field: React.ReactNode
    ) {
      groupStack.at(-1)!.children.push({
        type: 'field',
        path,
        node: setting,
        reactNode: field,
      })
    },
    endGroup(_path: string, _group: ConfigTree) {
      groupStack.pop()
    },
    build() {
      if (!rootNode.children.length) {
        return <></>
      }

      const renderNode = (node: LayoutNode): React.ReactNode => {
        if (node.type === 'group') {
          return node.children.length
            ? renderer.renderGroup({
                path: node.path,
                heading: renderer.translateGroupHeader(node.path),
                group: node.node,
                children: node.children.map(renderNode),
              })
            : null
        } else if (node.type === 'field') {
          return renderer.renderField({
            path: node.path,
            field: node.node,
            reactNode: node.reactNode,
          })
        }
      }

      return <>{...rootNode.children.map(renderNode)}</>
    },
  }
}
