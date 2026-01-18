import NativeComponentsView from '@/views/NativeComponents/NativeComponentsView'
import type { ViewId } from '../types'

const renderViewNode = (view: ViewId) => {
  switch (view) {
    case 'native':
      return <NativeComponentsView />
  }
}

export default function MainView({ view }: { view: ViewId }) {
  return <div>{renderViewNode(view)}</div>
}
