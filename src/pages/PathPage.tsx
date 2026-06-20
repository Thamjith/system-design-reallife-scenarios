import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { getPathById } from '../data/paths'
import { getScenarioBySlug } from '../data/scenarios'
import { useProgress } from '../hooks/useProgress'

export default function PathPage() {
  const { id } = useParams<{ id: string }>()
  const path = id ? getPathById(id) : undefined
  const { isComplete } = useProgress()

  useEffect(() => {
    document.title = path ? `${path.title} · Knowledge Base` : 'Learning Path · Knowledge Base'
  }, [path])

  const scenarios = useMemo(
    () => (path?.scenarios ?? []).map((slug) => getScenarioBySlug(slug)).filter(Boolean),
    [path],
  )

  const completedCount = path?.scenarios.filter((s) => isComplete(s)).length ?? 0
  const total = scenarios.length
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0

  const nextSlug = path?.scenarios.find((s) => !isComplete(s))

  if (!path) {
    return (
      <div className="page">
        <div className="page-inner page-inner--narrow">
          <div className="toolbar">
            <Link to="/paths" className="back-link">
              ← Learning paths
            </Link>
            <ThemeToggle />
          </div>
          <div className="status-message status-message--error">Path not found.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-inner page-inner--narrow">
        <div className="toolbar">
          <Link to="/paths" className="back-link">
            ← Learning paths
          </Link>
          <ThemeToggle />
        </div>

        <header className="page-header">
          <span className={`level-badge level-badge--${path.targetLevel}`} style={{ marginBottom: 14, display: 'inline-block' }}>
            {path.targetLevel.charAt(0).toUpperCase() + path.targetLevel.slice(1)}
          </span>
          <h1 className="page-title">{path.title}</h1>
          <p className="page-subtitle">{path.description}</p>
        </header>

        <div className="path-detail-progress">
          <div className="path-detail-progress-bar">
            <div className="path-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="path-detail-progress-label">
            {completedCount} of {total} complete
          </span>
          {nextSlug && (
            <Link to={`/${nextSlug}`} className="path-continue-btn">
              Continue →
            </Link>
          )}
          {completedCount === total && total > 0 && (
            <span className="path-complete-badge">✓ Complete</span>
          )}
        </div>

        <div className="path-scenario-list">
          {scenarios.map((sc, idx) =>
            sc ? (
              <Link
                key={sc.slug}
                to={`/${sc.slug}`}
                className={`path-scenario-item${isComplete(sc.slug) ? ' path-scenario-item--done' : ''}`}
              >
                <span className="path-scenario-num">{idx + 1}</span>
                <div className="path-scenario-info">
                  <span className="path-scenario-domain">{sc.domain}</span>
                  <span className="path-scenario-title">{sc.title}</span>
                </div>
                <div className="path-scenario-right">
                  <span className={`level-badge level-badge--${sc.level}`}>
                    {sc.level.charAt(0).toUpperCase() + sc.level.slice(1)}
                  </span>
                  <span className="path-scenario-time">{sc.readtime} min</span>
                  {isComplete(sc.slug) && <span className="path-scenario-check">✓</span>}
                </div>
              </Link>
            ) : null,
          )}
        </div>
      </div>
    </div>
  )
}
