import { LanguageProvider } from '@/contexts/LanguageContext'
import Navigation from '@/components/sections/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import CoreThesisSection from '@/components/sections/CoreThesisSection'
import ArticleIndexSection from '@/components/sections/ArticleIndexSection'
import InsightsArchiveSection from '@/components/sections/InsightsArchiveSection'
import FooterSection from '@/components/sections/FooterSection'
import type { ArticleData } from '@/types/articles'

interface Props {
  articleData?: ArticleData
}

export default function App({ articleData }: Props) {
  return (
    <LanguageProvider>
      <div style={{ background: '#050505', minHeight: '100vh' }}>
        <Navigation />
        <HeroSection recentArticles={articleData?.recent ?? []} />
        <CoreThesisSection />
        <ArticleIndexSection pillars={articleData?.pillars ?? []} />
        <InsightsArchiveSection spokes={articleData?.spokes ?? []} />
        <FooterSection />
      </div>
    </LanguageProvider>
  )
}
