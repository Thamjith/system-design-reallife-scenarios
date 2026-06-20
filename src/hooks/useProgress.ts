import { useState, useCallback } from 'react'

type ProgressEntry = { completedAt: number }
type ProgressMap = Record<string, ProgressEntry>

const STORAGE_KEY = 'kb-progress'

function readProgress(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeProgress(map: ProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(readProgress)

  const markComplete = useCallback((slug: string) => {
    setProgress((prev) => {
      if (prev[slug]) return prev
      const next = { ...prev, [slug]: { completedAt: Date.now() } }
      writeProgress(next)
      return next
    })
  }, [])

  const markIncomplete = useCallback((slug: string) => {
    setProgress((prev) => {
      if (!prev[slug]) return prev
      const next = { ...prev }
      delete next[slug]
      writeProgress(next)
      return next
    })
  }, [])

  const isComplete = useCallback((slug: string) => Boolean(progress[slug]), [progress])

  const completedSlugs = Object.keys(progress)

  const completedCount = completedSlugs.length

  const totalReadMinutes = completedSlugs.reduce((acc, _) => acc, 0)

  return { isComplete, markComplete, markIncomplete, completedCount, totalReadMinutes, completedSlugs }
}
