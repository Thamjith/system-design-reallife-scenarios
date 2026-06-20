import type { Level } from './scenarios'

export type LearningPath = {
  id: string
  title: string
  description: string
  targetLevel: Level
  estimatedHours: number
  scenarios: string[]
}

export const PATHS: LearningPath[] = [
  {
    id: 'surviving-oncall',
    title: 'Surviving On-Call',
    description:
      'The 5 topics that will save you on your first on-call rotation. Each article gives you an exact investigation playbook you can run at 2am.',
    targetLevel: 'junior',
    estimatedHours: 4,
    scenarios: [
      'cache-stampede',
      'thundering-herd',
      'mutex-lock',
      'autovacuum-postgresql',
      'factory-pattern',
    ],
  },
  {
    id: 'senior-systems',
    title: 'Senior Systems Thinking',
    description:
      'How to think about performance and scale. Covers the algorithm-choice and data-model decisions that separate senior from junior engineers.',
    targetLevel: 'senior',
    estimatedHours: 5,
    scenarios: [
      'cache-stampede',
      'thundering-herd',
      'autovacuum-postgresql',
      'dijkstra-vs-pathfinding',
      'h3-spatial-index',
    ],
  },
  {
    id: 'system-design-interview',
    title: 'System Design Interview Prep',
    description:
      'All 7 scenarios, in dependency order. Each article has level-separated interview questions from junior to staff with exact expected answers.',
    targetLevel: 'senior',
    estimatedHours: 8,
    scenarios: [
      'mutex-lock',
      'cache-stampede',
      'thundering-herd',
      'autovacuum-postgresql',
      'factory-pattern',
      'dijkstra-vs-pathfinding',
      'h3-spatial-index',
    ],
  },
]

export function getPathById(id: string): LearningPath | undefined {
  return PATHS.find((p) => p.id === id)
}
