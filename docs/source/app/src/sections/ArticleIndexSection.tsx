import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const STRIPS = [
  { id: '01', titleKey: 'index.strip.01.title', summaryKey: 'index.strip.01.summary', image: '/images/article-1.jpg' },
  { id: '02', titleKey: 'index.strip.02.title', summaryKey: 'index.strip.02.summary', image: '/images/article-2.jpg' },
  { id: '03', titleKey: 'index.strip.03.title', summaryKey: 'index.strip.03.summary', image: '/images/article-3.jpg' },
  { id: '04', titleKey: 'index.strip.04.title', summaryKey: 'index.strip.04.summary', image: '/images/article-4.jpg' },
]

export default function ArticleIndexSection() {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

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
    return `${50 / (STRIPS.length - 1)}%`
  }

  const getStripOpacity = (index: number) => {
    if (activeIndex === null) return 1
    return activeIndex === index ? 1 : 0.4
  }

  return (
    <section id="article-index" ref={sectionRef} className="relative" style={{ minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
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

      {/* Accordion */}
      <div className="flex-1 flex overflow-hidden" style={{ minHeight: '70vh' }}>
        {STRIPS.map((strip, index) => (
          <div
            key={strip.id}
            className="relative cursor-pointer overflow-hidden border-r border-white/10"
            style={{
              width: getStripWidth(index),
              opacity: getStripOpacity(index),
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
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
                  {t(strip.titleKey) as string}
                </h3>
                <div style={{
                  maxHeight: activeIndex === index ? '200px' : '0',
                  opacity: activeIndex === index ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease 0.2s',
                }}>
                  <p className="font-serif mt-4 text-[#EBEBEB]" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', lineHeight: 1.6, maxWidth: '400px' }}>
                    {t(strip.summaryKey) as string}
                  </p>
                  <button className="nav-link-underline mt-4 font-mono text-xs uppercase tracking-widest text-white" style={{ letterSpacing: '0.12em' }}>
                    {t('index.read') as string}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
