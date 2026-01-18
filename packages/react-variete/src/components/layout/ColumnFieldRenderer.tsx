import type { FieldRenderProps } from './types'

export default function ColumnFieldRenderer({
  path,
  field,
  reactNode,
}: FieldRenderProps) {
  return (
    <div className="rv-column-field" style={{ display: 'flex' }} key={path}>
      <div className="rv-field-label">
        <label>{field.name}</label>
      </div>
      <div className="rv-field-input">{reactNode}</div>
    </div>
  )
}
