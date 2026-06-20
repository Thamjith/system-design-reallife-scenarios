import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeToggle } from '../components/ThemeToggle'
import { PATHS } from '../data/paths'
import { useProgress } from '../hooks/useProgress'

export default function PathsPage() {
  const { isComplete } = useProgress()

  useEffect(() => {
    document.title = 'Learning Paths · Knowledge Base'
  }, [])

  return (
    <div className="page">
      <div className="page-inner page-inner--wide">
        <div className="toolbar toolbar--end">
          <ThemeToggle />
        </div>

        <header className="page-header">
          <div className="page-eyebrow">
            <Link to="/" className="back-link" style={{ fontSize: 12 }}>
              ← All scenarios
            </Link>
          </div>
          <h1 className="page-title">Learning Paths</h1>
          <p className="page-subtitle">
            Curated sequences of articles with a specific learning goal. Pick a path,
            work through the articles in order, and track your progress.
          </p>
        </header>

        <div className="paths-grid">
          {PATHS.map((path) => {
            const completedInPath = path.scenarios.filter((slug) => isComplete(slug)).length
            const total = path.scenarios.length
            const pct = Math.round((completedInPath / total) * 100)

            return (
              <Link key={path.id} to={`/paths/${path.id}`} className="path-card">
                <div className="path-card-header">
                  <span className={`level-badge level-badge--${path.targetLevel}`}>
                    {path.targetLevel.charAt(0).toUpperCase() + path.targetLevel.slice(1)}
                  </span>
                  <span className="path-card-time">{path.estimatedHours}h</span>
                </div>
                <h2 className="path-card-title">{path.title}</h2>
                <p className="path-card-desc">{path.description}</p>
                <div className="path-card-footer">
                  <div className="path-progress-bar">
                    <div className="path-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="path-progress-label">
                    {completedInPath}/{total} articles
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
