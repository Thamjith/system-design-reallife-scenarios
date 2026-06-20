# System Design: Real-Life Scenarios

Interview prep knowledge base covering production incidents across systems, databases, algorithms, and architecture. Each article follows the **Crisis to Wisdom** format — a real incident, why smart engineers get it wrong, an investigation playbook, and fixes at three levels: Junior, Senior, and Staff.

## Articles

| Topic | Domain | Level | Incident |
|---|---|---|---|
| [Cache Stampede](content/cache-stampede.md) | Reliability | Junior | 847 concurrent DB queries after hot key expiry |
| [Mutex Lock](content/mutex-lock.md) | Concurrency | Junior | $847k double-charge in 3 minutes |
| [Thundering Herd](content/thundering-herd.md) | Reliability | Junior | 72,000 DB queries in 4s after rolling restart |
| [Autovacuum in PostgreSQL](content/autovacuum-postgresql.md) | Data & Storage | Senior | 6 months of silent P99 degradation from dead tuples |
| [Dijkstra's vs Modern Pathfinding](content/dijkstra-vs-pathfinding.md) | Algorithms & Data Structures | Senior | Route calc spiked from 180ms → 1,100ms on 2.1M node graph |
| [H3 Spatial Index](content/h3-spatial-index.md) | Algorithms & Data Structures | Senior | Geofence queries degraded from 45ms → 2,800ms at 2.1M rows |
| [Factory Design Pattern](content/factory-pattern.md) | Architecture Patterns | Junior | Adding one notification channel required 14 file edits |

## Stack

- **React 19** + **React Router 7** + **TypeScript 5.7**
- **Vite 6** — bundler and dev server
- **marked** — Markdown → HTML
- **highlight.js** — syntax highlighting
- **mermaid** — flowcharts and sequence diagrams
- No backend, no database — pure static site

## Running Locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve dist/ locally
```

## Article Format

Every article follows the **Crisis to Wisdom** 9-section structure:

1. **The Incident** — fictional but realistic production incident with exact metrics, time, and scale
2. **Why Smart Engineers Get This Wrong** — the mental model failure, with an assumptions vs. reality table
3. **The Investigation Playbook** — numbered steps with exact SQL/bash commands, 2am-usable
4. **The Fix at Three Altitudes** — Junior (understand + apply), Senior (tune + operate + failure modes), Staff (design to avoid)
5. **The Decision Tree** — mermaid flowchart from observable symptom to action
6. **Interview Gauntlet** — questions at each level, expected answers, and the follow-up that separates levels
7. **Connections** — prerequisites, what this unlocks, related real-world incidents

The site renders level-tagged sections (`<!-- level:junior -->`) as interactive blocks. Use the **Junior / Senior / Staff** selector in the article toolbar to dim content outside your target level.

## Adding an Article

1. Create `content/<slug>.md` following the Crisis to Wisdom format (see [CLAUDE.md](CLAUDE.md) for the full spec)
2. Add an entry to `src/data/scenarios.ts`:

```ts
{
  slug: 'your-slug',
  title: 'Display Title',
  summary: 'One sentence describing the incident and what the reader learns.',
  tags: ['Tag1', 'Tag2'],
  level: 'junior',            // 'junior' | 'senior' | 'staff'
  prereqs: [],                // prerequisite slugs
  readtime: 12,               // minutes
  domain: 'Reliability',      // see valid domains in CLAUDE.md
  incidentType: 'latency spike',
}
```

## Domains

`Reliability` · `Concurrency` · `Data & Storage` · `Distributed Systems` · `Algorithms & Data Structures` · `Architecture Patterns`
