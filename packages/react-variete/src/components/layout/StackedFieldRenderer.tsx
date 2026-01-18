import type { FieldRenderProps } from './types'

export default function StackedFieldRenderer({
  path,
  field,
  reactNode,
}: FieldRenderProps) {
  return (
    <div key={path}>
      <label>{field.name}</label>
      <div>{reactNode}</div>
    </div>
  )
}
