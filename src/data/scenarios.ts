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
  {
    slug: 'progressive-hydration',
    title: 'Progressive Hydration',
    summary:
      'A Black Friday React 18 migration pushed TTI from 2.1s to 8.9s — not the server, not the CDN, but eager full-tree hydration blocking the main thread for 6.2 seconds.',
    tags: ['React', 'Performance', 'Frontend'],
    level: 'senior',
    prereqs: [],
    readtime: 13,
    domain: 'Architecture Patterns',
    incidentType: 'Core Web Vitals regression',
  },
  {
    slug: 'browser-memory-leaks',
    title: 'Browser Memory Leaks',
    summary:
      'A note-taking SPA consumed 2.4 GB of RAM after 4 hours of use, crashing tabs. Every note open/close cycle accumulated a detached 40 KB DOM tree — never cleaned up by a missing useEffect return.',
    tags: ['Frontend', 'Performance', 'React'],
    level: 'senior',
    prereqs: [],
    readtime: 14,
    domain: 'Reliability',
    incidentType: 'memory leak',
  },
  {
    slug: 'jwt-vs-session',
    title: 'JWT vs Session Authentication',
    summary:
      'A compromised admin account was disabled in the database at 14:20 — but the attacker\'s JWT was valid for 23 more hours. 14,200 customer records exfiltrated before the token expired naturally.',
    tags: ['Security', 'Authentication', 'Architecture'],
    level: 'junior',
    prereqs: [],
    readtime: 12,
    domain: 'Architecture Patterns',
    incidentType: 'security incident',
  },
  {
    slug: 'monotonic-stack',
    title: 'Monotonic Stack',
    summary:
      'A nightly price-drop batch job scaled from 4 seconds to 47 minutes as the catalog grew from 50k to 2.8M products. O(n²) nested loop replaced with O(n) monotonic stack.',
    tags: ['Algorithms', 'Data Structures'],
    level: 'junior',
    prereqs: [],
    readtime: 11,
    domain: 'Algorithms & Data Structures',
    incidentType: 'performance regression',
  },
  {
    slug: 'public-key-cryptography',
    title: 'Public Key Cryptography',
    summary:
      'A one-line verify=False flag shipped to production. For 6 hours, an attacker in the same VPC intercepted service-to-service billing traffic. From the mechanics of TLS to mutual TLS and zero-trust.',
    tags: ['Security', 'Cryptography', 'Distributed Systems'],
    level: 'senior',
    prereqs: [],
    readtime: 15,
    domain: 'Distributed Systems',
    incidentType: 'security incident',
  },
  {
    slug: 'sargable-query',
    title: 'Sargable Queries and Index Usage',
    summary:
      'User search degraded from P99 50ms to 12,000ms overnight with no deploys. A LOWER() call in the WHERE clause turned a 5ms index lookup into a full scan of 4.2M rows.',
    tags: ['Databases', 'PostgreSQL', 'Performance', 'Indexing'],
    level: 'senior',
    prereqs: ['autovacuum-postgresql'],
    readtime: 12,
    domain: 'Data & Storage',
    incidentType: 'latency spike',
  },
  {
    slug: 'print-vs-logger',
    title: 'print() vs Structured Logger',
    summary:
      'A production outage lasted 4 hours instead of 20 minutes because the on-call had zero logs. print() statements went to stdout; the container shipped only stderr to the log aggregator.',
    tags: ['Observability', 'DevOps', 'Reliability'],
    level: 'junior',
    prereqs: [],
    readtime: 10,
    domain: 'Reliability',
    incidentType: 'observability failure',
  },
  {
    slug: 'oltp-vs-olap',
    title: 'OLTP vs OLAP',
    summary:
      'A "quick" Monday morning revenue report held shared locks on the orders table for 42 minutes, queueing 53 concurrent checkout writes and causing a 44% conversion drop.',
    tags: ['Databases', 'Analytics', 'Performance'],
    level: 'senior',
    prereqs: [],
    readtime: 14,
    domain: 'Data & Storage',
    incidentType: 'lock contention',
  },
  {
    slug: 'api-idempotency',
    title: 'Making APIs Idempotent',
    summary:
      'A mobile retry bug generated a new idempotency key per attempt instead of reusing the original. The server correctly processed each "unique" request. 127 customers double-charged: $14,240 refunded.',
    tags: ['API Design', 'Reliability', 'Distributed Systems'],
    level: 'junior',
    prereqs: ['mutex-lock'],
    readtime: 13,
    domain: 'Architecture Patterns',
    incidentType: 'data corruption',
  },
  {
    slug: 'unlogged-table-postgresql',
    title: 'Unlogged Tables in PostgreSQL',
    summary:
      'A planned failover emptied 14.2 million precomputed recommendation scores. The table was UNLOGGED — never written to WAL, never replicated, truncated on every failover. 300k users, 2 hours, no recommendations.',
    tags: ['PostgreSQL', 'Databases', 'Reliability'],
    level: 'senior',
    prereqs: ['autovacuum-postgresql'],
    readtime: 11,
    domain: 'Data & Storage',
    incidentType: 'data loss',
  },
]

export function getScenarioBySlug(slug: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.slug === slug)
}
