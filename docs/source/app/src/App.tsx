import Navigation from './sections/Navigation'
import HeroSection from './sections/HeroSection'
import CoreThesisSection from './sections/CoreThesisSection'
import ArticleIndexSection from './sections/ArticleIndexSection'
import InsightsArchiveSection from './sections/InsightsArchiveSection'
import FooterSection from './sections/FooterSection'

export default function App() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh' }}>
      <Navigation />
      <HeroSection />
      <CoreThesisSection />
      <ArticleIndexSection />
      <InsightsArchiveSection />
      <FooterSection />
    </div>
  )
}
