import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = useCallback((label: string) => {
    const sectionMap: Record<string, string> = {
      GEO: '#article-index',
      SEO: '#insights',
      Insights: '#insights',
      Contact: '#footer',
    }
    const targetId = sectionMap[label]
    if (targetId) {
      const el = document.querySelector(targetId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }, [])

  const navItems = [
    { key: 'nav.geo', action: 'GEO' },
    { key: 'nav.seo', action: 'SEO' },
    { key: 'nav.insights', action: 'Insights' },
    { key: 'nav.contact', action: 'Contact' },
  ]

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(6px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(6px) saturate(140%)' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        <a href="#" className="flex flex-col items-start leading-none">
          <span className="font-display text-white" style={{ fontSize: '0.95rem', letterSpacing: '0.06em', fontWeight: 700, lineHeight: 1.1 }}>
            Visibility Guide
          </span>
          <span className="font-serif italic" style={{ fontSize: '0.62rem', color: '#A0A0A0', letterSpacing: '0.04em', lineHeight: 1.3, marginTop: '1px' }}>
            by NMC Interactive
          </span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => scrollToSection(item.action)}
              className="nav-link-underline font-mono text-xs uppercase tracking-widest text-[#A0A0A0] transition-colors duration-200 hover:text-white"
              style={{ letterSpacing: '0.12em' }}
            >
              {t(item.key) as string}
            </button>
          ))}
          <LanguageSwitcher />
        </div>

        <button
          className="flex items-center justify-center text-white md:hidden"
          style={{ width: 36, height: 36 }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="flex flex-col gap-4 px-6 pb-6 md:hidden"
          style={{ background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(12px)' }}
        >
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => scrollToSection(item.action)}
              className="text-left font-mono text-sm uppercase tracking-widest text-[#A0A0A0] transition-colors duration-200 hover:text-white"
              style={{ letterSpacing: '0.12em', padding: '8px 0' }}
            >
              {t(item.key) as string}
            </button>
          ))}
          <LanguageSwitcher mobile />
        </div>
      )}
    </nav>
  )
}
