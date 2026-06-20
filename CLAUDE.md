# CLAUDE.md

## Project

React + Vite + TypeScript knowledge base. Interview prep reference for system design / CS topics. Each scenario = one card on home, one article page.

## Stack

- React 19, React Router 7, TypeScript 5.7
- Vite 6 (bundler + dev server)
- `marked` (MD → HTML), `highlight.js` (syntax highlighting), `mermaid` (diagram rendering)
- No state management lib, no test framework, no CSS-in-JS

## Commands

```bash
npm run dev      # dev server (localhost:5173)
npm run build    # tsc + vite build → dist/
npm run preview  # serve dist/
```

## Architecture

```
content/          ← one .md file per scenario (slug.md)
src/
  data/
    scenarios.ts  ← SCENARIOS array (all fields below)
    content.ts    ← glob-imports all content/*.md at build time
  pages/
    HomePage.tsx  ← grid + search/tag/level filter
    ScenarioPage.tsx ← renders single scenario via slug
  components/
    MarkdownArticle.tsx  ← hljs + mermaid + level-block DOM processing
    ScenarioCard.tsx
    ThemeToggle.tsx
  context/
    ThemeContext.tsx
    LevelContext.tsx  ← persists active reading level (all/junior/senior/staff)
  hooks/
    useProgress.ts   ← localStorage read/completion tracking
  styles/
    global.css
    markdown.css
```

## Adding a New Scenario

Two steps, must stay in sync:

1. **`content/<slug>.md`** — write the article (Crisis to Wisdom format — see below)
2. **`src/data/scenarios.ts`** — add entry to `SCENARIOS` array:

```ts
{
  slug: 'your-slug',          // must match filename exactly
  title: 'Display Title',
  summary: 'One punchy sentence — describe the production incident and what the reader learns.',
  tags: ['Tag1', 'Tag2'],     // reuse existing tags to keep filter useful
  level: 'junior',            // primary target: 'junior' | 'senior' | 'staff'
  prereqs: [],                // slugs of articles to read first (empty array if none)
  readtime: 12,               // estimated minutes
  domain: 'Reliability',      // one of the 6 domains listed below
  incidentType: 'latency spike', // short label for the incident type
}
```

**Valid domains:** `Reliability` · `Concurrency` · `Data & Storage` · `Distributed Systems` · `Algorithms & Data Structures` · `Architecture Patterns`

Content is eager-loaded via `import.meta.glob` at build time — no runtime fetch needed.

## Routing

- `/` → `HomePage`
- `/:slug` → `ScenarioPage` (reads slug from URL, looks up metadata + markdown)

## Theming

CSS custom properties on `:root` / `[data-theme="dark"]`. Toggle via `ThemeContext`. No Tailwind, no CSS modules.

---

## Content Format: Crisis to Wisdom

Every article in `content/` must follow this 8-section format, in order. No exceptions. The goal is to create the *question* in the reader's mind before providing the answer — engineers learn through operational pain, not academic exposition.

### Section 1: The Incident

Open with a fictional but realistic production incident. Required elements:

- **Company archetype** — "Threadly (social content platform)", "Payflow (B2B payments)", etc.
- **Scale** — "~800k DAU, 22k RPS peak"
- **Time** — always late-night/weekend: "00:07", "02:14 Friday"
- **Specific metrics** — P99 latency numbers, error rate %, affected user count
- **What the on-call checked first — and why it was wrong** — this is the hook
- **First-person plural** — "we woke to PagerDuty", "we ran EXPLAIN ANALYZE"

The incident must end with the moment of realization — the specific log line, query result, or metric that revealed the true cause.

### Section 2: Why Smart Engineers Get This Wrong

Name the mental model failure. Not "people don't know X" — "people apply model Y in situation Z, which makes Y fail."

Must end with a 3-row table:

| What engineers assume | What actually happens |
|---|---|
| [specific wrong belief] | [specific reality] |

This section must produce "I would have made that exact mistake" in a senior engineer reading it.

### Section 3: The Investigation Playbook

Numbered steps. Exact commands, SQL queries, bash one-liners. 2am-usable.

Not: "check your metrics." Yes: "run this SQL against `pg_stat_activity` and look for `xact_start` older than 1 hour."

Each step ends with a `> **What you're looking for:**` block describing the specific value or pattern that confirms the hypothesis.

### Section 4–6: The Fix at Three Altitudes

Three level-tagged blocks. Use HTML comments — they survive `marked.parse()` unchanged and are processed by `MarkdownArticle.tsx` into interactive sections:

```markdown
<!-- level:junior -->

### Junior: Understand It and Apply the Standard Fix

[content]

<!-- /level:junior -->

<!-- level:senior -->

### Senior: Tune It, Operate It, Know When It Fails

[content]

<!-- /level:senior -->

<!-- level:staff -->

### Staff: Design Systems That Don't Need This Fix

[content]

<!-- /level:staff -->
```

**Junior block:** Explain the mechanism with one concrete analogy, then show the minimal working implementation. Code-heavy. Happy path only. This is "I need to pass the interview."

**Senior block:** Assumes junior content is known. Covers: what parameters matter and why, how to instrument it, the 3 failure modes to watch for, what production rollout looks like. Include a monitoring/alerting setup.

**Staff block:** Reframes the problem. Asks: why are we in a position where this mitigation is needed? Shows the architectural decision that eliminates the problem class entirely. Ends with:
- One mermaid `flowchart TD` showing the architectural alternative
- A direct quote: `> "[what a staff engineer would say in a design review]"`
- A "Prerequisites for the architectural alternative" note (when is the junior/senior fix actually the right call?)

### Section 7: The Decision Tree

A mermaid `flowchart TD` starting from the observable symptom. Branches on real operational questions — scale thresholds, ownership boundaries, latency budgets — not academic criteria.

```markdown
## The Decision Tree

\`\`\`mermaid
flowchart TD
    A["Seeing [symptom]?"] --> B{Condition?}
    B -- Yes --> C["Action + rationale"]
    B -- No --> D{Next condition?}
\`\`\`
```

### Section 8: Interview Gauntlet

Three subsections: `### Junior questions`, `### Senior questions`, `### Staff questions`.

Each question must have:
- **Q:** the question text
- **Expected:** the answer at that level (specific, not generic)
- **Follow-up that separates [this level] from [next level]:** the question that reveals depth
- **30-second one-liner:** what to say if blanking

### Section 9: Connections

Three lines at the end:

```markdown
## Connections

**Before this:** [slug](/slug) — one sentence on why it's a prerequisite  
**After this:** [slug](/slug) (what this topic unlocks), [slug2](/slug2)  
**Related incidents:**
- *Company/event name* — one sentence on which specific mechanism failed
- *Company/event name* — one sentence
```

---

## Mermaid Diagrams

Add mermaid diagrams where they replace hard-to-visualize prose. Supported types:

```markdown
\`\`\`mermaid
flowchart LR
    A["Step 1"] --> B["Step 2"]
\`\`\`
```

Use for:
- **Flows / state machines** (`flowchart`, `stateDiagram-v2`) — autovacuum cycle, mutex states
- **Sequence diagrams** (`sequenceDiagram`) — cache stampede, request coalescing
- **Class diagrams** (`classDiagram`) — factory pattern hierarchies
- **Hierarchy / tree** (`graph TD`) — H3 resolution levels
- **Decision tree** (`flowchart TD`) — required in the Staff section

Do **not** add diagrams for decoration. Only use one when it meaningfully shortens or clarifies prose.

Mermaid is initialized in `MarkdownArticle.tsx` with `theme: neutral` (light) or `dark` based on `document.documentElement.dataset.theme`. Re-initialization across theme switches requires a page reload (known limitation, acceptable).

---

## Key Constraints

- No backend — pure static site
- Tags are free-form strings; reuse existing tags to keep filter useful
- `slug` in `scenarios.ts` must exactly match `content/<slug>.md` filename
- `level`, `prereqs`, `readtime`, `domain`, `incidentType` are required fields — build fails without them
- No tests — verify by running `npm run dev` and checking in browser
- Level tags (`<!-- level:junior -->`) must wrap complete H3 sections — do not split a heading from its content across a tag boundary
