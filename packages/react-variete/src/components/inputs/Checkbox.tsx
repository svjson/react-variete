import React from 'react'

export function Checkbox({
  checked,
  onCheckedChange,
  ...props
}: {
  onCheckedChange: (value: boolean) => void
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      checked={checked ?? false}
      onChange={(e) => onCheckedChange(Boolean(e.target.checked))}
      {...props}
    />
  )
}
