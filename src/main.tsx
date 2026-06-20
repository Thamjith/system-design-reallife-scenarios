import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { LevelProvider } from './context/LevelContext'
import './styles/global.css'
import './styles/markdown.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LevelProvider>
        <App />
      </LevelProvider>
    </ThemeProvider>
  </StrictMode>,
)
