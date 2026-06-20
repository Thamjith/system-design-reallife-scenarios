import { createContext, useContext, useState, type ReactNode } from 'react'

export type ActiveLevel = 'all' | 'junior' | 'senior' | 'staff'

type LevelContextValue = {
  activeLevel: ActiveLevel
  setActiveLevel: (level: ActiveLevel) => void
}

const LevelContext = createContext<LevelContextValue | null>(null)

function readStoredLevel(): ActiveLevel {
  try {
    return (localStorage.getItem('kb-level') as ActiveLevel) || 'all'
  } catch {
    return 'all'
  }
}

export function LevelProvider({ children }: { children: ReactNode }) {
  const [activeLevel, setActiveLevelState] = useState<ActiveLevel>(readStoredLevel)

  function setActiveLevel(level: ActiveLevel) {
    setActiveLevelState(level)
    try {
      localStorage.setItem('kb-level', level)
    } catch {
      /* ignore */
    }
  }

  return (
    <LevelContext.Provider value={{ activeLevel, setActiveLevel }}>
      {children}
    </LevelContext.Provider>
  )
}

export function useLevel() {
  const ctx = useContext(LevelContext)
  if (!ctx) throw new Error('useLevel must be used within LevelProvider')
  return ctx
}
