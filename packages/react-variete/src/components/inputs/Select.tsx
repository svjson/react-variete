import React from 'react'

export function Select({
  value,
  options,
  onValueChange,
  ...props
}: {
  value: string
  options: readonly {
    value: string
    label?: string
    disabled?: boolean
  }[]
  onValueChange: (value: string) => void
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      {...props}
    >
      {options.map((v) => (
        <option key={v.value} value={v.value}>
          {v.label ?? v.value}
        </option>
      ))}
    </select>
  )
}
