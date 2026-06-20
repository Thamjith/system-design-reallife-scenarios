const modules = import.meta.glob<string>('../../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const contentBySlug = new Map<string, string>()

for (const [path, text] of Object.entries(modules)) {
  const slug = path.match(/\/([^/]+)\.md$/)?.[1]
  if (slug) contentBySlug.set(slug, text)
}

export function getMarkdownContent(slug: string): string | undefined {
  return contentBySlug.get(slug)
}

export function hasMarkdownContent(slug: string): boolean {
  return contentBySlug.has(slug)
}
