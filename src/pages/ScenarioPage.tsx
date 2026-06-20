import { useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { MarkdownArticle } from '../components/MarkdownArticle'
import { ThemeToggle } from '../components/ThemeToggle'
import { getMarkdownContent } from '../data/content'
import { getScenarioBySlug, SCENARIOS } from '../data/scenarios'
import { useLevel, type ActiveLevel } from '../context/LevelContext'
import { useProgress } from '../hooks/useProgress'

const LEVEL_LABELS: Record<ActiveLevel, string> = {
  all: 'All',
  junior: 'Junior',
  senior: 'Senior',
  staff: 'Staff',
}

const LEVELS: ActiveLevel[] = ['all', 'junior', 'senior', 'staff']

export default function ScenarioPage() {
  const { slug } = useParams<{ slug: string }>()
  const { activeLevel, setActiveLevel } = useLevel()
  const { isComplete, markComplete } = useProgress()

  const meta = slug ? getScenarioBySlug(slug) : undefined
  const markdown = slug ? getMarkdownContent(slug) : undefined

  const html = useMemo(() => {
    if (!markdown) return ''
    return marked.parse(markdown) as string
  }, [markdown])

  useEffect(() => {
    document.title = meta
      ? `${meta.title} · Knowledge Base`
      : 'Technical Scenarios · Knowledge Base'
  }, [meta])

  // Mark article complete after 30s of reading
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!slug || !markdown) return
    timerRef.current = setTimeout(() => markComplete(slug), 30_000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [slug, markdown, markComplete])

  const prereqScenarios = useMemo(
    () => (meta?.prereqs ?? []).map((s) => SCENARIOS.find((sc) => sc.slug === s)).filter(Boolean),
    [meta],
  )

  const errorMsg = !slug
    ? 'No scenario specified.'
    : !markdown
      ? `Could not load content for "${slug}".`
      : null

  const completed = slug ? isComplete(slug) : false

  return (
    <div className="page">
      <div className="page-inner page-inner--narrow">
        <div className="toolbar">
          <Link to="/" className="back-link">
            <span style={{ fontSize: 15 }}>←</span> All scenarios
          </Link>
          <div className="toolbar-right">
            <div className="level-selector" role="group" aria-label="Reading level">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  className={`level-selector-btn${activeLevel === lvl ? ' level-selector-btn--active' : ''}`}
                  onClick={() => setActiveLevel(lvl)}
                >
                  {LEVEL_LABELS[lvl]}
                </button>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>

        {meta && (
          <div className="scenario-meta-row">
            <div className="scenario-tags">
              <span className={`level-badge level-badge--${meta.level}`}>
                {meta.level.charAt(0).toUpperCase() + meta.level.slice(1)}
              </span>
              <span className="tag-badge domain-badge">{meta.domain}</span>
              {meta.tags.map((t) => (
                <span key={t} className="tag-badge">
                  {t}
                </span>
              ))}
            </div>
            <div className="scenario-readtime">
              {completed && <span className="readtime-check">✓</span>}
              <span className="readtime-label">{meta.readtime} min read</span>
            </div>
          </div>
        )}

        {errorMsg ? (
          <div className="status-message status-message--error">{errorMsg}</div>
        ) : (
          <MarkdownArticle html={html} activeLevel={activeLevel} />
        )}

        {prereqScenarios.length > 0 && (
          <div className="prereq-section">
            <p className="prereq-label">Read this first</p>
            <div className="prereq-list">
              {prereqScenarios.map((sc) =>
                sc ? (
                  <Link key={sc.slug} to={`/${sc.slug}`} className="prereq-card">
                    <span className={`level-badge level-badge--${sc.level}`}>
                      {sc.level.charAt(0).toUpperCase() + sc.level.slice(1)}
                    </span>
                    <span className="prereq-title">{sc.title}</span>
                    <span className="prereq-arrow">→</span>
                  </Link>
                ) : null,
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
