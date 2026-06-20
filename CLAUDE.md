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
    scenarios.ts  ← SCENARIOS array (slug, title, summary, tags[])
    content.ts    ← glob-imports all content/*.md at build time
  pages/
    HomePage.tsx  ← grid + search/tag filter
    ScenarioPage.tsx ← renders single scenario via slug
  components/
    MarkdownArticle.tsx
    ScenarioCard.tsx
    ThemeToggle.tsx
  context/
    ThemeContext.tsx
  styles/
    global.css
    markdown.css
```

## Adding a New Scenario

Two steps, must stay in sync:

1. **`content/<slug>.md`** — write the article
2. **`src/data/scenarios.ts`** — add entry to `SCENARIOS` array:
   ```ts
   {
     slug: 'your-slug',      // must match filename exactly
     title: 'Display Title',
     summary: 'One sentence.',
     tags: ['Tag1', 'Tag2'],
   }
   ```

Content is eager-loaded via `import.meta.glob` at build time — no runtime fetch needed.

## Routing

- `/` → `HomePage`
- `/:slug` → `ScenarioPage` (reads slug from URL, looks up metadata + markdown)

## Theming

CSS custom properties on `:root` / `[data-theme="dark"]`. Toggle via `ThemeContext`. No Tailwind, no CSS modules.

## Content Quality Guidelines

Every article in `content/` must follow this structure:

1. **Plain-English analogy first** — open with a real-world metaphor before any jargon. One short paragraph, no bullet points.
2. **Problem statement** — what breaks without this, and why it matters.
3. **Solution / approach** — technical depth, code examples, comparison tables.
4. **Interview gotchas** — traps, distinctions, and one-liners interviewers love.

### Mermaid diagrams

Add mermaid diagrams where they replace hard-to-visualize prose. Supported diagram types (via `mermaid` npm package, rendered in `MarkdownArticle.tsx`):

```markdown
\`\`\`mermaid
flowchart LR
    A["Step 1"] --> B["Step 2"]
\`\`\`
```

Use diagrams for:
- **Flows / state machines** (`flowchart`, `stateDiagram-v2`) — e.g. autovacuum cycle, mutex states
- **Sequence diagrams** (`sequenceDiagram`) — e.g. cache stampede, request coalescing
- **Class diagrams** (`classDiagram`) — e.g. factory pattern hierarchies
- **Hierarchy / tree** (`graph TD`) — e.g. H3 resolution levels

Do **not** add diagrams just for decoration. Only use one when it meaningfully shortens or clarifies prose.

Mermaid is initialized in `MarkdownArticle.tsx` with `theme: neutral` (light) or `dark` based on `document.documentElement.dataset.theme` at render time. Re-initialization across theme switches requires a page reload (known limitation, acceptable).

## Key Constraints

- No backend — pure static site
- Tags are free-form strings; reuse existing tags to keep filter useful
- `slug` in `scenarios.ts` must exactly match `content/<slug>.md` filename
- No tests — verify by running `npm run dev` and checking in browser
