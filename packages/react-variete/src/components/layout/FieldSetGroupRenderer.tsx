import type { GroupRenderProps } from './types'

export default function FieldSetGroupRenderer({
  path,
  children,
}: GroupRenderProps) {
  return (
    <fieldset key={path || '__root'}>
      <legend>{path ?? 'root'}</legend>
      {...children}
    </fieldset>
  )
}
