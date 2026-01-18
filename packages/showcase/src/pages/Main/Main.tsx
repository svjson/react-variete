import { useState } from 'react'
import MainView from './components/MainView'
import type { ViewId } from './types'
import Sidebar from './components/Sidebar'
import '../../showcase.css'
import { useConfig } from '@/context/config'

export default function MainPage() {
  const [view, setView] = useState<ViewId>('native')

  const darkMode = useConfig('demo.interface.appearance.darkMode')

  return (
    <div className={`rv-showcase${darkMode ? ' dark-mode' : ''}`}>
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
