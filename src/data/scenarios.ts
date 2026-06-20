export type Scenario = {
  slug: string
  title: string
  summary: string
  tags: string[]
}

export const SCENARIOS: Scenario[] = [
  {
    slug: 'autovacuum-postgresql',
    title: 'Autovacuum in PostgreSQL',
    summary:
      'How MVCC produces dead tuples, how the autovacuum daemon reclaims them and prevents XID wraparound, and how to tune it.',
    tags: ['Databases', 'PostgreSQL', 'Performance'],
  },
  {
    slug: 'h3-spatial-index',
    title: 'Hexagonal Hierarchical Spatial Index (H3)',
    summary:
      "Why hexagons beat square grids for geospatial indexing, how H3's resolutions work, and the pentagon / approximate-hierarchy caveats.",
    tags: ['Geospatial', 'Data Structures', 'Indexing'],
  },
  {
    slug: 'factory-pattern',
    title: 'Factory Design Pattern',
    summary:
      'Simple Factory vs Factory Method vs Abstract Factory — what each decouples, when to use which, and how they relate to dependency inversion.',
    tags: ['Design Patterns', 'OOP'],
  },
  {
    slug: 'dijkstra-vs-pathfinding',
    title: "Dijkstra's Algorithm vs. Modern Pathfinding",
    summary:
      'Dijkstra as the baseline, A* and bidirectional search as informed speedups, and the 2025 result breaking the sorting barrier.',
    tags: ['Algorithms', 'Graphs'],
  },
  {
    slug: 'thundering-herd',
    title: 'Thundering Herd',
    summary:
      'Why waking every waiter on a shared event causes load spikes, and the two solution families: wake fewer vs spread over time.',
    tags: ['Concurrency', 'Systems', 'Scalability'],
  },
  {
    slug: 'cache-stampede',
    title: 'Cache Stampede (Dog-Piling)',
    summary:
      'When a hot key expires and concurrent misses dog-pile the database — locking, probabilistic early expiry, and stale-while-revalidate.',
    tags: ['Caching', 'Systems', 'Scalability'],
  },
  {
    slug: 'mutex-lock',
    title: 'Mutex Lock',
    summary:
      'Mutual exclusion for critical sections: ownership, reentrancy, CAS-based implementation, spinlocks vs blocking, deadlock and priority inversion.',
    tags: ['Concurrency', 'Operating Systems'],
  },
]

export function getScenarioBySlug(slug: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.slug === slug)
}
