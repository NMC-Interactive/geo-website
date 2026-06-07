import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

interface InsightArticle {
  id: string
  titleKey: string
  category: string
  excerptKey: string
  image: string
  date: string
  readTime: string
  featured?: boolean
}

const ARTICLES: InsightArticle[] = [
  { id: '1', titleKey: 'insight.1.title', category: 'GEO', excerptKey: 'insight.1.excerpt', image: '/images/article-1.jpg', date: '2026.05.12', readTime: '12 min', featured: true },
  { id: '2', titleKey: 'insight.2.title', category: 'SEO', excerptKey: 'insight.2.excerpt', image: '/images/article-2.jpg', date: '2026.04.28', readTime: '8 min' },
  { id: '3', titleKey: 'insight.3.title', category: 'GEO', excerptKey: 'insight.3.excerpt', image: '/images/article-3.jpg', date: '2026.04.15', readTime: '15 min' },
  { id: '4', titleKey: 'insight.4.title', category: 'Case Studies', excerptKey: 'insight.4.excerpt', image: '/images/article-4.jpg', date: '2026.03.30', readTime: '10 min' },
  { id: '5', titleKey: 'insight.5.title', category: 'SEO', excerptKey: 'insight.5.excerpt', image: '/images/article-1.jpg', date: '2026.03.18', readTime: '11 min' },
  { id: '6', titleKey: 'insight.6.title', category: 'GEO', excerptKey: 'insight.6.excerpt', image: '/images/article-2.jpg', date: '2026.03.05', readTime: '9 min' },
  { id: '7', titleKey: 'insight.7.title', category: 'Resources', excerptKey: 'insight.7.excerpt', image: '/images/article-3.jpg', date: '2026.02.20', readTime: '18 min' },
  { id: '8', titleKey: 'insight.8.title', category: 'GEO', excerptKey: 'insight.8.excerpt', image: '/images/article-4.jpg', date: '2026.02.08', readTime: '14 min', featured: true },
]

const BG_NUMBERS = ['01', '02', '03']

export default function InsightsArchiveSection() {
  const { t, lang } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('ALL')
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgNumbersRef = useRef<HTMLDivElement>(null)

  // Category keys for display
  const categoryKeys: Record<string, string> = {
    'ALL': 'insights.cat.all',
    'GEO': 'insights.cat.geo',
    'SEO': 'insights.cat.seo',
    'Case Studies': 'insights.cat.case',
    'Resources': 'insights.cat.resources',
  }

  const categoryList = ['ALL', 'GEO', 'SEO', 'Case Studies', 'Resources']

  const filteredArticles = activeCategory === 'ALL'
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === activeCategory)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.article-card')
      cards.forEach((card) => {
        gsap.fromTo(card, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top bottom-=5%', toggleActions: 'play none none reverse' },
        })
      })

      if (bgNumbersRef.current) {
        const numbers = bgNumbersRef.current.querySelectorAll('.bg-number')
        numbers.forEach((num) => {
          gsap.fromTo(num, { opacity: 0 }, {
            opacity: 0.04,
            scrollTrigger: { trigger: num, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      }
    }, section)

    return () => ctx.revert()
  }, [filteredArticles])

  return (
    <section id="insights" ref={sectionRef} className="relative" style={{ background: '#050505' }}>
      {/* Background Numbers */}
      <div ref={bgNumbersRef} className="pointer-events-none absolute inset-0 overflow-hidden">
        {BG_NUMBERS.map((num, i) => (
          <div
            key={num}
            className="bg-number font-display absolute left-1/2 -translate-x-1/2 text-white"
            style={{
              top: `${i * 120 + 20}%`,
              fontSize: 'clamp(15rem, 30vw, 30rem)',
              lineHeight: 1,
              opacity: 0,
              letterSpacing: '-0.06em',
            }}
          >
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

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-4">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="font-mono text-xs uppercase tracking-widest transition-colors duration-200"
                style={{
                  letterSpacing: '0.12em',
                  color: activeCategory === cat ? '#FFFFFF' : '#A0A0A0',
                  borderBottom: activeCategory === cat ? '1px solid #FFFFFF' : '1px solid transparent',
                  paddingBottom: '2px',
                }}
              >
                {t(categoryKeys[cat]) as string}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        <div className="px-8 pb-20 md:px-12">
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
            {filteredArticles.map((article) => {
              const isFeatured = article.featured
              return (
                <div
                  key={`${lang}-${article.id}`}
                  className="article-card group cursor-pointer"
                  style={{ gridColumn: isFeatured ? 'span 16' : 'span 8', gridRow: isFeatured ? 'span 2' : 'span 1' }}
                >
                  <div
                    className="relative overflow-hidden border border-white/10 bg-[#111111] transition-all duration-300 group-hover:border-white/25"
                    style={{ borderRadius: '2px', height: '100%' }}
                  >
                    <div className="relative overflow-hidden" style={{ height: isFeatured ? '60%' : '200px' }}>
                      <img src={article.image} alt={t(article.titleKey) as string} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111111 0%, transparent 50%)' }} />
                      <span
                        className="absolute top-3 left-3 font-mono text-xs uppercase tracking-widest"
                        style={{ letterSpacing: '0.1em', color: '#A0A0A0', background: 'rgba(5,5,5,0.7)', padding: '2px 8px', borderRadius: '2px' }}
                      >
                        {article.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3
                        className="font-display text-white transition-colors duration-200 group-hover:text-[#3B82F6]"
                        style={{ fontSize: isFeatured ? 'clamp(1.2rem, 2vw, 1.8rem)' : 'clamp(1rem, 1.4vw, 1.2rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}
                      >
                        {t(article.titleKey) as string}
                      </h3>
                      <p
                        className="mt-3 font-serif text-[#A0A0A0]"
                        style={{ fontSize: '0.85rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: isFeatured ? 4 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {t(article.excerptKey) as string}
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="font-mono text-xs text-[#A0A0A0]" style={{ letterSpacing: '0.08em' }}>{article.date}</span>
                        <span className="text-[#A0A0A0]">&middot;</span>
                        <span className="font-mono text-xs text-[#A0A0A0]" style={{ letterSpacing: '0.08em' }}>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
