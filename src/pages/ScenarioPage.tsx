import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { MarkdownArticle } from '../components/MarkdownArticle'
import { ThemeToggle } from '../components/ThemeToggle'
import { getMarkdownContent } from '../data/content'
import { getScenarioBySlug } from '../data/scenarios'

export default function ScenarioPage() {
  const { slug } = useParams<{ slug: string }>()

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

  const errorMsg = !slug
    ? 'No scenario specified.'
    : !markdown
      ? `Could not load content for "${slug}".`
      : null

  return (
    <div className="page">
      <div className="page-inner page-inner--narrow">
        <div className="toolbar">
          <Link to="/" className="back-link">
            <span style={{ fontSize: 15 }}>←</span> All scenarios
          </Link>
          <ThemeToggle />
        </div>

        {meta && meta.tags.length > 0 && (
          <div className="scenario-tags">
            {meta.tags.map((t) => (
              <span key={t} className="tag-badge">
                {t}
              </span>
            ))}
          </div>
        )}

        {errorMsg ? (
          <div className="status-message status-message--error">{errorMsg}</div>
        ) : (
          <MarkdownArticle html={html} />
        )}
      </div>
    </div>
  )
}
