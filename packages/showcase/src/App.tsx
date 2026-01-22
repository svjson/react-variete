import { useEffect } from 'react'
import MainPage from './pages/Main/Main'
import { useConfig } from '@/context/config'

export default function App() {
  const darkMode = useConfig('demo.interface.appearance.darkMode')

  useEffect(() => {
    const root = document.body
    root.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  return (
    <>
      <MainPage />
    </>
  )
}
