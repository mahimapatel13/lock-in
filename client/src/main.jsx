import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App"
import './index.css'

import { AuthProvider } from './hooks/useAuth'
import { PomodoroProvider } from './context/PomodoroContext'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AuthProvider>
   <PomodoroProvider>
     <App/>
    </PomodoroProvider>
  </AuthProvider>
  
  // </StrictMode>,
)
