import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ArticleEntry } from '@/types/articles'
import { clusterImage } from '@/types/articles'

gsap.registerPlugin(ScrollTrigger)

const BG_NUMBERS = ['01', '02', '03']

// Maps cluster → stable date string for display (fallback when no pubDate)
const CLUSTER_DATE: Record<string, string> = {
  'GEO Fundamentals':   '2026.05.12',
  'China AI Ecosystem': '2026.04.28',
  'World-to-China':     '2026.04.15',
  'China-to-World':     '2026.03.30',
}

interface Props {
  spokes: ArticleEntry[]
}

export default function InsightsArchiveSection({ spokes }: Props) {
  const { t, lang } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('ALL')
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgNumbersRef = useRef<HTMLDivElement>(null)

  // Build category list from actual clusters present in spokes
  const clusters = Array.from(new Set(spokes.map(s => s.cluster).filter(Boolean)))
  const categoryList = ['ALL', ...clusters]

  // Derive category key for i18n (fall back to literal label)
  const categoryLabel = (cat: string) => {
    const key = `insights.cat.${cat.toLowerCase().replace(/\s+/g, '.').replace(/-/g, '')}`
    const translated = t(key) as string
    return translated === key ? cat : translated
  }

  const filteredSpokes = activeCategory === 'ALL'
    ? spokes
    : spokes.filter(s => s.cluster === activeCategory)

  // Mark the first spoke of each cluster as featured
  const seenClusters = new Set<string>()
  const articles = filteredSpokes.map(s => {
    const isFeatured = !seenClusters.has(s.cluster)
    if (isFeatured) seenClusters.add(s.cluster)
    return { ...s, isFeatured }
  })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.article-card')
      cards.forEach(card => {
        gsap.fromTo(card, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top bottom-=5%', toggleActions: 'play none none reverse' },
        })
      })
      if (bgNumbersRef.current) {
        bgNumbersRef.current.querySelectorAll('.bg-number').forEach(num => {
          gsap.fromTo(num, { opacity: 0 }, {
            opacity: 0.04,
            scrollTrigger: { trigger: num, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      }
    }, section)
    return () => ctx.revert()
  }, [filteredSpokes])

  return (
    <section id="insights" ref={sectionRef} className="relative" style={{ background: '#050505' }}>
      <div ref={bgNumbersRef} className="pointer-events-none absolute inset-0 overflow-hidden">
        {BG_NUMBERS.map((num, i) => (
          <div key={num} className="bg-number font-display absolute left-1/2 -translate-x-1/2 text-white"
            style={{ top: `${i * 120 + 20}%`, fontSize: 'clamp(15rem, 30vw, 30rem)', lineHeight: 1, opacity: 0, letterSpacing: '-0.06em' }}>
            {num}
          </div>
        ))}
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="px-8 pt-20 pb-8 md:px-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A0A0A0]" style={{ letterSpacing: '0.15em' }}>
              {t('insights.label.number') as string}
            </span>
            <div className="h-px w-12 bg-white/15" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#A0A0A0]" style={{ letterSpacing: '0.15em' }}>
              {t('insights.label.title') as string}
            </span>
          </div>

          {/* Category filter — driven by actual clusters */}
          <div className="flex flex-wrap items-center gap-4">
            {categoryList.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="font-mono text-xs uppercase tracking-widest transition-colors duration-200"
                style={{
                  letterSpacing: '0.12em',
                  color: activeCategory === cat ? '#FFFFFF' : '#A0A0A0',
                  borderBottom: activeCategory === cat ? '1px solid #FFFFFF' : '1px solid transparent',
                  paddingBottom: '2px',
                }}>
                {cat === 'ALL' ? (t('insights.cat.all') as string) : categoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        <div className="px-8 pb-20 md:px-12">
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
            {articles.map(article => (
              <a
                key={`${lang}-${article.url}`}
                href={article.url}
                className="article-card group cursor-pointer"
                style={{
                  gridColumn: article.isFeatured ? 'span 16' : 'span 8',
                  gridRow: article.isFeatured ? 'span 2' : 'span 1',
                  textDecoration: 'none',
                }}
              >
                <div className="relative overflow-hidden border border-white/10 bg-[#111111] transition-all duration-300 group-hover:border-white/25"
                  style={{ borderRadius: '2px', height: '100%' }}>
                  <div className="relative overflow-hidden" style={{ height: article.isFeatured ? '60%' : '200px' }}>
                    <img
                      src={clusterImage(article.cluster)}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111111 0%, transparent 50%)' }} />
                    <span className="absolute top-3 left-3 font-mono text-xs uppercase tracking-widest"
                      style={{ letterSpacing: '0.1em', color: '#A0A0A0', background: 'rgba(5,5,5,0.7)', padding: '2px 8px', borderRadius: '2px' }}>
                      {article.cluster}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-white transition-colors duration-200 group-hover:text-[#3B82F6]"
                      style={{ fontSize: article.isFeatured ? 'clamp(1.2rem, 2vw, 1.8rem)' : 'clamp(1rem, 1.4vw, 1.2rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-3 font-serif text-[#A0A0A0]"
                        style={{
                          fontSize: '0.85rem', lineHeight: 1.6,
                          display: '-webkit-box', WebkitLineClamp: article.isFeatured ? 4 : 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                        {article.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-3">
                      <span className="font-mono text-xs text-[#A0A0A0]" style={{ letterSpacing: '0.08em' }}>
                        {article.pubDate ?? CLUSTER_DATE[article.cluster] ?? '2026.06.01'}
                      </span>
                      <span className="text-[#A0A0A0]">&middot;</span>
                      <span className="font-mono text-xs text-[#A0A0A0]" style={{ letterSpacing: '0.08em' }}>
                        {article.readTime ?? '8 min'}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
