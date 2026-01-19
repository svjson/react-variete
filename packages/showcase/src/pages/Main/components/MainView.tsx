import NativeComponentsView from '@/views/NativeComponents/NativeComponentsView'
import RadixUIComponentsView from '@/views/RadixUIComponents/RadixUIComponents'
import type { ViewId } from '../types'

const renderViewNode = (view: ViewId) => {
  switch (view) {
    case 'native':
      return <NativeComponentsView />
    case 'radix-ui':
      return <RadixUIComponentsView />
  }
}

export default function MainView({ view }: { view: ViewId }) {
  return <div>{renderViewNode(view)}</div>
}
