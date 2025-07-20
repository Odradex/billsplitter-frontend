import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SessionProvider } from './contexts/SessionContext.tsx'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.ts'
import { setupTelegramMock } from './lib/setupTelegramMock.ts'

setupTelegramMock();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <App />
      </SessionProvider>
    </QueryClientProvider>
  </StrictMode>
)
