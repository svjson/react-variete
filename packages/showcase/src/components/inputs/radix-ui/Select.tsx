import * as Select from '@radix-ui/react-select'

export function SelectBox({
  value,
  options,
  onValueChange,
}: {
  value: string
  options: readonly {
    value: string
    label?: string
    disabled?: boolean
  }[]
  onValueChange: (value: string) => void
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger />
      <Select.Content>
        {options.map((opt) => (
          <Select.Item
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
          >
            <Select.ItemText>{opt.label ?? opt.value}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
