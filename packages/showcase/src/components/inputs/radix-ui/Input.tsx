import React from 'react'

export function Input({
  value,
  onValueChange,
  ...props
}: {
  value: string
  onValueChange: (value: string) => void
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  )
}

export function NumberInput({
  value,
  onValueChange,
  ...props
}: {
  value: number
  onValueChange: (value: number) => void
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="number"
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value))}
    />
  )
}
