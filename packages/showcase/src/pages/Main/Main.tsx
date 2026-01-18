import { useState } from 'react'
import MainView from './components/MainView'
import type { ViewId } from './types'
import Sidebar from './components/Sidebar'
import '../../showcase.css'

export default function MainPage() {
  const [view, setView] = useState<ViewId>('native')

  return (
    <div className="rv-showcase">
      <div className="app">
        <aside>
          <Sidebar view={view} onSelectView={setView} />
        </aside>
        <main>
          <MainView view={view} />
        </main>
      </div>
    </div>
  )
}
