import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { lang, toggle } = useLanguage()

  if (mobile) {
    return (
      <div className="flex items-center justify-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="font-mono text-xs" style={{ color: '#666666', letterSpacing: '0.1em' }}>
          Language
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="font-mono text-xs transition-colors duration-200"
            style={{
              letterSpacing: '0.1em',
              color: lang === 'en' ? '#FFFFFF' : '#666666',
              fontWeight: lang === 'en' ? 600 : 400,
              padding: '2px 8px',
              borderRadius: '3px',
              background: lang === 'en' ? 'rgba(59,130,246,0.15)' : 'transparent',
              border: lang === 'en' ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
            }}
          >
            EN
          </button>
          <span style={{ color: '#444444' }}>/</span>
          <button
            onClick={toggle}
            className="font-mono text-xs transition-colors duration-200"
            style={{
              letterSpacing: '0.1em',
              color: lang === 'zh' ? '#FFFFFF' : '#666666',
              fontWeight: lang === 'zh' ? 600 : 400,
              padding: '2px 8px',
              borderRadius: '3px',
              background: lang === 'zh' ? 'rgba(59,130,246,0.15)' : 'transparent',
              border: lang === 'zh' ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
            }}
          >
            ZH
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 font-mono text-xs transition-all duration-200"
      style={{
        letterSpacing: '0.1em',
        color: '#A0A0A0',
        padding: '3px 10px',
        borderRadius: '4px',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#FFFFFF'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#A0A0A0'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
      }}
    >
      <span style={{ color: lang === 'en' ? '#3B82F6' : '#666666', fontWeight: lang === 'en' ? 600 : 400 }}>EN</span>
      <span style={{ color: '#444444' }}>/</span>
      <span style={{ color: lang === 'zh' ? '#3B82F6' : '#666666', fontWeight: lang === 'zh' ? 600 : 400 }}>中文</span>
    </button>
  )
}
