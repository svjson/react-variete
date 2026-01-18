import type { GroupRenderProps } from './types'

export default function HeadingGroupRenderer({
  path,
  children,
}: GroupRenderProps) {
  return (
    <div className="rv-heading-group" key={path || '__root'}>
      <h3>{path ?? 'root'}</h3>
      {...children}
    </div>
  )
}
