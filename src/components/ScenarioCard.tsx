import { Link } from 'react-router-dom'
import type { Scenario } from '../data/scenarios'

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <Link to={`/${scenario.slug}`} className="scenario-card">
      <div className="scenario-card-header">
        <h2 className="scenario-card-title">{scenario.title}</h2>
        <span className="scenario-card-arrow">→</span>
      </div>
      <p className="scenario-card-summary">{scenario.summary}</p>
      <div className="tag-list">
        {scenario.tags.map((tag) => (
          <span key={tag} className="tag-badge">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
