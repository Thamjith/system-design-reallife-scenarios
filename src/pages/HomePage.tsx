import { useMemo, useState } from 'react'
import { ScenarioCard } from '../components/ScenarioCard'
import { ThemeToggle } from '../components/ThemeToggle'
import { SCENARIOS } from '../data/scenarios'
import type { Level } from '../data/scenarios'

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--text-3)"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ flex: 'none' }}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  )
}

const LEVEL_OPTIONS: Array<{ value: Level | 'all'; label: string }> = [
  { value: 'junior', label: 'Junior' },
  { value: 'senior', label: 'Senior' },
  { value: 'staff', label: 'Staff' },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [activeLevels, setActiveLevels] = useState<Level[]>([])
  const allTags = useMemo(
    () => [...new Set(SCENARIOS.flatMap((s) => s.tags))].sort(),
    [],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SCENARIOS.filter((s) => {
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      const matchesTags =
        activeTags.length === 0 || activeTags.some((t) => s.tags.includes(t))
      const matchesLevel =
        activeLevels.length === 0 || activeLevels.includes(s.level)
      return matchesQuery && matchesTags && matchesLevel
    })
  }, [query, activeTags, activeLevels])

  const total = SCENARIOS.length
  const n = filtered.length
  const hasFilters = query.trim().length > 0 || activeTags.length > 0 || activeLevels.length > 0
  const countLabel = hasFilters
    ? `${n} of ${total} ${total === 1 ? 'scenario' : 'scenarios'}`
    : `${total} ${total === 1 ? 'scenario' : 'scenarios'}`

  const toggleTag = (name: string) => {
    setActiveTags((tags) =>
      tags.includes(name) ? tags.filter((t) => t !== name) : [...tags, name],
    )
  }

  const toggleLevel = (level: Level) => {
    setActiveLevels((lvls) =>
      lvls.includes(level) ? lvls.filter((l) => l !== level) : [...lvls, level],
    )
  }

  const hasAnyFilter = activeTags.length > 0 || activeLevels.length > 0

  return (
    <div className="page">
      <div className="page-inner page-inner--wide">
        <div className="toolbar toolbar--end">
          <ThemeToggle />
        </div>

        <header className="page-header">
          <div className="page-eyebrow">Interview Prep · Knowledge Base</div>
          <h1 className="page-title">Technical Scenarios</h1>
          <p className="page-subtitle">
            Crisis-to-wisdom articles covering real production incidents at three levels:
            Junior, Senior, and Staff. Each article includes an investigation playbook,
            code examples, and level-separated interview questions.
          </p>
        </header>

        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search scenarios, tags, keywords…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <span className="filter-label">Level</span>
          {LEVEL_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`tag-chip ${activeLevels.includes(value as Level) ? 'tag-chip--active' : ''}`}
              onClick={() => toggleLevel(value as Level)}
            >
              {label}
            </button>
          ))}
          <span className="filter-label" style={{ marginLeft: 8 }}>
            Tag
          </span>
          {allTags.map((name) => (
            <button
              key={name}
              type="button"
              className={`tag-chip ${activeTags.includes(name) ? 'tag-chip--active' : ''}`}
              onClick={() => toggleTag(name)}
            >
              {name}
            </button>
          ))}
          {hasAnyFilter && (
            <button
              type="button"
              className="clear-tags"
              onClick={() => {
                setActiveTags([])
                setActiveLevels([])
              }}
            >
              clear ✕
            </button>
          )}
        </div>

        <div className="count-row">
          <span className="count-label">{countLabel}</span>
        </div>

        <div className="scenario-list">
          {filtered.map((s) => (
            <ScenarioCard key={s.slug} scenario={s} />
          ))}
        </div>

        {SCENARIOS.length > 0 && n === 0 && (
          <div className="empty-state">No scenarios match your filters.</div>
        )}
      </div>
    </div>
  )
}
