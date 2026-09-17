import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from './app/AppRoutes'
import { AppProviders } from './app/AppProviders'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </StrictMode>,
)
