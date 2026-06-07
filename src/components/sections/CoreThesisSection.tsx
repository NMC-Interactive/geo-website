import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function CoreThesisSection() {
  const { t, lang } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const wordsContainerRef = useRef<HTMLDivElement>(null)

  const thesisText = t('thesis.text') as string

  useEffect(() => {
    const section = sectionRef.current
    const wordsContainer = wordsContainerRef.current
    if (!section || !wordsContainer) return

    const chars = wordsContainer.querySelectorAll<HTMLSpanElement>('.velo-char')
    if (chars.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          willChange: 'opacity, filter, transform',
          opacity: 0.1,
          scale: 0.6,
          rotationZ: () => gsap.utils.random(-20, 20),
          filter: 'blur(12px) brightness(20%)',
          yPercent: () => gsap.utils.random(-40, 40),
        },
        {
          ease: 'power2',
          opacity: 1,
          scale: 1,
          rotationZ: 0,
          filter: 'blur(0px) brightness(100%)',
          yPercent: 0,
          stagger: { each: 0.05, from: 'center' },
          scrollTrigger: {
            trigger: wordsContainer,
            start: 'top bottom-=10%',
            end: 'center top+=10%',
            scrub: 0.5,
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const renderCharacters = () => {
    const words = thesisText.split(' ')
    return words.map((word, wordIndex) => (
      <span key={`${lang}-${wordIndex}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {word.split('').map((char, charIndex) => (
          <span key={`${lang}-${wordIndex}-${charIndex}`} className="velo-char" style={{ display: 'inline-block' }}>
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 && (
          <span className="velo-char" style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
        )}
      </span>
    ))
  }

  return (
    <section
      id="core-thesis"
      ref={sectionRef}
      className="relative flex items-center justify-center"
      style={{ minHeight: '100vh', background: '#050505', padding: '20vh 1.5rem' }}
    >
      <div className="mx-auto max-w-6xl">
        <div
          ref={wordsContainerRef}
          className="font-serif text-center"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
            lineHeight: 1.3,
            color: '#EBEBEB',
            fontStyle: 'italic',
            fontWeight: 400,
          }}
        >
          {renderCharacters()}
        </div>
        <div className="mt-12 flex items-center justify-center gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#A0A0A0]" style={{ letterSpacing: '0.15em' }}>
            {t('thesis.label.number') as string}
          </span>
          <div className="h-px w-12 bg-white/15" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#A0A0A0]" style={{ letterSpacing: '0.15em' }}>
            {t('thesis.label.title') as string}
          </span>
        </div>
      </div>
    </section>
  )
}
