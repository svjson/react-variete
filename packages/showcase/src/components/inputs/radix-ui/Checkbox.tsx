import React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

export function Checkbox({
  checked,
  onCheckedChange,
  ...props
}: {
  checked: boolean
  onCheckedChange: (value: boolean) => void
} & React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={(v) => {
        if (v !== 'indeterminate') onCheckedChange(v)
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator>✔</CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
