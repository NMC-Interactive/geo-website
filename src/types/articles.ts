export interface ArticleEntry {
  title: string
  url: string
  cluster: string
  // tier discriminators
  pillar?: number
  spoke?: string
  detail?: string
  parentPillar?: string
  parentSpoke?: string
  // optional enrichment
  excerpt?: string
  summary?: string
  image?: string
  featured?: boolean
  readTime?: string
  pubDate?: string
  updatedDate?: string
  author?: string
}

export interface ArticleData {
  pillars: ArticleEntry[]
  spokes: ArticleEntry[]
  recent: ArticleEntry[]
}

// Maps cluster name → image path (cycles through 4 stock images)
export const CLUSTER_IMAGES: Record<string, string> = {
  'GEO Fundamentals': '/images/article-1.jpg',
  'China AI Ecosystem': '/images/article-2.jpg',
  'World-to-China': '/images/article-3.jpg',
  'China-to-World': '/images/article-4.jpg',
}

export function clusterImage(cluster?: string): string {
  return (cluster && CLUSTER_IMAGES[cluster]) ?? '/images/article-1.jpg'
}
