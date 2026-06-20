import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ScenarioPage from './pages/ScenarioPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<ScenarioPage />} />
      </Routes>
    </BrowserRouter>
  )
}
