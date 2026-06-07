import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ArticleEntry } from '@/types/articles'
import { clusterImage } from '@/types/articles'

gsap.registerPlugin(ScrollTrigger)

// Fallback strips shown when no pillar data is passed
const FALLBACK_STRIPS = [
  { id: '01', title: 'THE ALGORITHMIC MIND', summary: 'Understanding how generative engines process, synthesize, and present information in the age of AI-driven search.', image: '/images/article-1.jpg', url: '#' },
  { id: '02', title: 'SYNTAX & SEMANTICS',   summary: 'The linguistic architecture that bridges human intent and machine comprehension in modern content systems.',            image: '/images/article-2.jpg', url: '#' },
  { id: '03', title: 'INDEXING TOMORROW',    summary: 'How next-generation crawlers and AI agents discover, evaluate, and rank content across the digital landscape.',         image: '/images/article-3.jpg', url: '#' },
  { id: '04', title: 'HUMAN INTENT',         summary: 'Decoding the psychological patterns behind search behavior and crafting content that anticipates need.',                image: '/images/article-4.jpg', url: '#' },
]

interface Props {
  pillars: ArticleEntry[]
}

export default function ArticleIndexSection({ pillars }: Props) {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const strips = pillars.length >= 4
    ? pillars.slice(0, 4).map((p, i) => ({
        id: String(i + 1).padStart(2, '0'),
        title: p.title.toUpperCase(),
        summary: p.excerpt ?? `Explore the complete guide to ${p.cluster}.`,
        image: clusterImage(p.cluster),
        url: p.url,
      }))
    : FALLBACK_STRIPS

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.fromTo(section, { opacity: 0 }, {
        opacity: 1, duration: 0.6,
        scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 30%', toggleActions: 'play none none reverse' },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const getStripWidth = (index: number) => {
    if (activeIndex === null) return '25%'
    if (activeIndex === index) return '50%'
    return `${50 / (strips.length - 1)}%`
  }

  const getStripOpacity = (index: number) => {
    if (activeIndex === null) return 1
    return activeIndex === index ? 1 : 0.4
  }

  return (
    <section id="article-index" ref={sectionRef} className="relative" style={{ minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column' }}>
      <div className="px-8 pt-20 pb-8 md:px-12">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#A0A0A0]" style={{ letterSpacing: '0.15em' }}>
            {t('index.label.number') as string}
          </span>
          <div className="h-px w-12 bg-white/15" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#A0A0A0]" style={{ letterSpacing: '0.15em' }}>
            {t('index.label.title') as string}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden" style={{ minHeight: '70vh' }}>
        {strips.map((strip, index) => (
          <a
            key={strip.id}
            href={strip.url}
            className="relative cursor-pointer overflow-hidden border-r border-white/10"
            style={{
              width: getStripWidth(index),
              opacity: getStripOpacity(index),
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${strip.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: activeIndex === index ? 0.3 : 0,
                transition: 'opacity 0.6s ease',
              }}
            />
            <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
              <div>
                <span className="font-mono text-xs text-[#A0A0A0]" style={{ letterSpacing: '0.1em' }}>{strip.id}</span>
              </div>
              <div>
                <h3
                  className="font-display uppercase text-white"
                  style={{
                    fontSize: activeIndex === index ? 'clamp(1.5rem, 3vw, 3rem)' : 'clamp(0.8rem, 1.2vw, 1.2rem)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    writingMode: activeIndex === index ? 'horizontal-tb' : 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: activeIndex === index ? 'none' : 'rotate(180deg)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {strip.title}
                </h3>
                <div style={{
                  maxHeight: activeIndex === index ? '200px' : '0',
                  opacity: activeIndex === index ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease 0.2s',
                }}>
                  <p className="font-serif mt-4 text-[#EBEBEB]" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', lineHeight: 1.6, maxWidth: '400px' }}>
                    {strip.summary}
                  </p>
                  <span className="nav-link-underline mt-4 inline-block font-mono text-xs uppercase tracking-widest text-white" style={{ letterSpacing: '0.12em' }}>
                    {t('index.read') as string}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
