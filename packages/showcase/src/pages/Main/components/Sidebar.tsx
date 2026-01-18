import type { ViewId } from '../types'

export default function Sidebar({
  view,
  onSelectView,
}: {
  view: ViewId
  onSelectView: (view: ViewId) => void
}) {
  return (
    <nav>
      <h3 style={{ marginTop: 6 }}>Showcase</h3>
      <button
        className={`nav-button${view === 'native' ? ' active' : ''}`}
        onClick={() => onSelectView('native')}
      >
        Native HTML Inputs
      </button>
    </nav>
  )
}
