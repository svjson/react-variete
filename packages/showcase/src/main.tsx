import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ConfigProvider } from './context/config'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider config={{}} store='local-storage'>
      <App />
    </ConfigProvider>
  </StrictMode>
)
