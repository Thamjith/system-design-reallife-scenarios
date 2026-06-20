import { Link } from 'react-router-dom'
import type { Scenario } from '../data/scenarios'

type ScenarioCardProps = {
  scenario: Scenario
  completed?: boolean
}

export function ScenarioCard({ scenario, completed = false }: ScenarioCardProps) {
  const levelLabel = scenario.level.charAt(0).toUpperCase() + scenario.level.slice(1)

  return (
    <Link
      to={`/${scenario.slug}`}
      className={`scenario-card${completed ? ' scenario-card--completed' : ''}`}
    >
      <p className="scenario-card-eyebrow">{scenario.domain}</p>
      <div className="scenario-card-header">
        <h2 className="scenario-card-title">{scenario.title}</h2>
        <div className="scenario-card-header-meta">
          <span className="scenario-card-readtime">{scenario.readtime} min</span>
          <span className="scenario-card-arrow">→</span>
        </div>
      </div>
      <p className="scenario-card-summary">{scenario.summary}</p>
      <div className="tag-list">
        <span className={`level-badge level-badge--${scenario.level}`}>{levelLabel}</span>
        {scenario.tags.map((tag) => (
          <span key={tag} className="tag-badge">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
