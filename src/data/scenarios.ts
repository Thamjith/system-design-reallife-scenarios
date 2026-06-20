export type Level = 'junior' | 'senior' | 'staff'

export type Scenario = {
  slug: string
  title: string
  summary: string
  tags: string[]
  level: Level
  prereqs: string[]
  readtime: number
  domain: string
  incidentType: string
}

export const SCENARIOS: Scenario[] = [
  {
    slug: 'cache-stampede',
    title: 'Cache Stampede (Dog-Piling)',
    summary:
      'A hot cache key expires and 847 concurrent readers race to the database at once. From the 00:07 PagerDuty alert to event-driven cache invalidation.',
    tags: ['Caching', 'Systems', 'Scalability'],
    level: 'junior',
    prereqs: [],
    readtime: 15,
    domain: 'Reliability',
    incidentType: 'latency spike',
  },
  {
    slug: 'mutex-lock',
    title: 'Mutex Lock',
    summary:
      '$847k charged to 1,200 customers twice in 3 minutes. From the race condition that caused it to distributed locking and idempotency as a first-class primitive.',
    tags: ['Concurrency', 'Operating Systems'],
    level: 'junior',
    prereqs: [],
    readtime: 16,
    domain: 'Concurrency',
    incidentType: 'data corruption',
  },
  {
    slug: 'thundering-herd',
    title: 'Thundering Herd',
    summary:
      '6,000 WebSocket clients reconnect simultaneously after a rolling restart, sending 72,000 database queries in 4 seconds. Jitter, admission control, and stateless gateways.',
    tags: ['Concurrency', 'Systems', 'Scalability'],
    level: 'junior',
    prereqs: ['cache-stampede'],
    readtime: 14,
    domain: 'Reliability',
    incidentType: 'cascading failure',
  },
  {
    slug: 'autovacuum-postgresql',
    title: 'Autovacuum in PostgreSQL',
    summary:
      '6 months of silent query degradation — no deploys, no schema changes. 8.2M dead tuples had corrupted the query planner. Fixed in 4 minutes with VACUUM ANALYZE.',
    tags: ['Databases', 'PostgreSQL', 'Performance'],
    level: 'senior',
    prereqs: [],
    readtime: 15,
    domain: 'Data & Storage',
    incidentType: 'silent performance degradation',
  },
  {
    slug: 'dijkstra-vs-pathfinding',
    title: "Dijkstra's Algorithm vs. Modern Pathfinding",
    summary:
      'Traffic-aware routing on a 2.1M node graph pushed route calculations from 180ms to 1,100ms. A* reduced it to 110ms. Contraction Hierarchies to 6ms.',
    tags: ['Algorithms', 'Graphs'],
    level: 'senior',
    prereqs: [],
    readtime: 16,
    domain: 'Algorithms & Data Structures',
    incidentType: 'latency spike',
  },
  {
    slug: 'h3-spatial-index',
    title: 'Hexagonal Hierarchical Spatial Index (H3)',
    summary:
      'Geofence queries degraded from 45ms to 2,800ms at 2.1M rows. PostGIS GiST index was wrong for this query pattern. H3 cell lookup fixed it in 8ms.',
    tags: ['Geospatial', 'Data Structures', 'Indexing'],
    level: 'senior',
    prereqs: ['dijkstra-vs-pathfinding'],
    readtime: 15,
    domain: 'Algorithms & Data Structures',
    incidentType: 'latency spike',
  },
  {
    slug: 'factory-pattern',
    title: 'Factory Design Pattern',
    summary:
      'Adding one notification channel required editing 14 files and shipped a silent bug. From direct instantiation collapse to plugin architecture.',
    tags: ['Design Patterns', 'OOP'],
    level: 'junior',
    prereqs: [],
    readtime: 14,
    domain: 'Architecture Patterns',
    incidentType: 'maintainability collapse',
  },
]

export function getScenarioBySlug(slug: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.slug === slug)
}
