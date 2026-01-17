import { useConfig } from './context/config'

export default function App() {
  const { title } = useConfig('demo')

  return <div>{title}</div>
}
