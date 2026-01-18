import type { GroupRenderProps } from './types'

export default function FieldSetGroupRenderer({
  path,
  heading,
  children,
}: GroupRenderProps) {
  return (
    <fieldset key={path || '__root'}>
      <legend>{heading ?? path ?? 'root'}</legend>
      {...children}
    </fieldset>
  )
}
