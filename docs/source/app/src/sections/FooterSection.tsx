import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function FooterSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    if (!section || !heading) return

    const ctx = gsap.context(() => {
      const columns = section.querySelectorAll('.footer-column')
      gsap.fromTo(columns, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top bottom-=10%', toggleActions: 'play none none reverse' },
      })
      gsap.fromTo(heading, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: heading, start: 'top bottom-=5%', toggleActions: 'play none none reverse' },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <footer id="footer" ref={sectionRef} className="relative" style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      {/* CTA Block */}
      <div className="px-8 py-24 md:px-12">
        <div ref={headingRef}>
          <h2
            className="font-display uppercase text-white"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.04em' }}
          >
            {t('footer.contact.line1') as string}
            <br />
            {t('footer.contact.line2') as string}
          </h2>
          <p
            className="font-serif italic"
            style={{ color: '#A0A0A0', fontSize: 'clamp(0.85rem, 1.8vw, 1.15rem)', marginTop: '0.4rem', letterSpacing: '0.02em' }}
          >
            {t('footer.contact.byline') as string}
          </p>
        </div>
        <div className="mt-8 flex items-center gap-6">
          <a
            href="mailto:hello@aura.geo"
            className="nav-link-underline font-mono text-sm uppercase tracking-widest text-[#A0A0A0] transition-colors duration-200 hover:text-white"
            style={{ letterSpacing: '0.1em' }}
          >
            {t('footer.email') as string}
          </a>
          <span className="text-[#A0A0A0]">&middot;</span>
          <span className="font-mono text-sm text-[#A0A0A0]" style={{ letterSpacing: '0.08em' }}>
            {t('footer.location') as string}
          </span>
        </div>
      </div>

      {/* Footer Links Grid */}
      <div className="px-8 pb-16 md:px-12">
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}
        >
          <div className="footer-column">
            <h4 className="font-mono text-xs uppercase tracking-widest text-white" style={{ letterSpacing: '0.15em', marginBottom: '1rem' }}>
              {t('footer.col.platform') as string}
            </h4>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.geo') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.seo') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.content') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.rank') as string}</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="font-mono text-xs uppercase tracking-widest text-white" style={{ letterSpacing: '0.15em', marginBottom: '1rem' }}>
              {t('footer.col.resources') as string}
            </h4>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.docs') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.api') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.cases') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.blog') as string}</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="font-mono text-xs uppercase tracking-widest text-white" style={{ letterSpacing: '0.15em', marginBottom: '1rem' }}>
              {t('footer.col.company') as string}
            </h4>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.about') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.careers') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.press') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.contact') as string}</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="font-mono text-xs uppercase tracking-widest text-white" style={{ letterSpacing: '0.15em', marginBottom: '1rem' }}>
              {t('footer.col.legal') as string}
            </h4>
            <ul className="flex flex-col gap-2">
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.privacy') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.terms') as string}</a></li>
              <li><a href="#" className="nav-link-underline font-mono text-xs text-[#A0A0A0] transition-colors duration-200 hover:text-white" style={{ letterSpacing: '0.06em' }}>{t('footer.link.cookies') as string}</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="flex flex-col items-center justify-between gap-4 px-8 py-6 md:flex-row md:px-12"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex flex-col items-start leading-none">
          <span
            className="font-display text-[#A0A0A0]"
            style={{ fontSize: '0.8rem', letterSpacing: '0.06em', fontWeight: 700, lineHeight: 1.1 }}
          >
            {t('footer.contact.line2') as string}
          </span>
          <span
            className="font-serif italic"
            style={{ fontSize: '0.55rem', color: '#666666', letterSpacing: '0.04em', lineHeight: 1.3, marginTop: '1px' }}
          >
            {t('footer.contact.byline') as string}
          </span>
        </div>
        <span className="font-mono text-xs text-[#A0A0A0]" style={{ letterSpacing: '0.06em' }}>
          {t('footer.copyright') as string}
        </span>
        <span className="font-mono text-xs text-[#A0A0A0]" style={{ letterSpacing: '0.06em' }}>
          {t('footer.tag') as string}
        </span>
      </div>
    </footer>
  )
}
