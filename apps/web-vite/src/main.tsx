import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './router.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import AuthProvider from './providers/AuthProvider'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
  </StrictMode>,
)
