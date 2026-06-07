import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type Lang = 'en' | 'zh'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: string) => string | string[]
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider')
  return ctx
}

const TRANSLATIONS: Record<string, Record<Lang, string | string[]>> = {
  // Navigation
  'nav.geo': { en: 'GEO', zh: 'GEO' },
  'nav.seo': { en: 'SEO', zh: 'SEO' },
  'nav.insights': { en: 'Insights', zh: '洞见' },
  'nav.contact': { en: 'Contact', zh: '联系' },

  // Hero
  'hero.headline.line1': { en: 'SHAPE THE', zh: '掌控无形' },
  'hero.headline.line2': { en: 'INVISIBLE', zh: '驾驭搜索' },
  'hero.subtitle': { en: 'GEO / SEO Intelligence Platform', zh: 'GEO / SEO 智能平台' },
  'hero.cta': { en: 'Initialize Connection', zh: '开启连接' },

  // Terminal
  'terminal.header': { en: '$ _CONTENT_DISCOVERY_PROTOCOL', zh: '$ _内容发现协议' },
  'terminal.log1': { en: '> initializing content_discovery_protocol...', zh: '> 正在初始化内容发现协议...' },
  'terminal.log2': { en: '> connecting to generative_index_nodes...', zh: '> 正在连接生成式索引节点...' },
  'terminal.log3': { en: '> handshake_complete — 8 resources available', zh: '> 握手完成 — 8 个资源可用' },
  'terminal.log4': { en: '> awaiting user_input...', zh: '> 等待用户输入...' },
  'terminal.status.resources': { en: 'RESOURCES', zh: '资源' },
  'terminal.status.live': { en: 'LIVE', zh: '在线' },
  'terminal.status.new': { en: 'NEW', zh: '新增' },
  'terminal.prompt': { en: 'select_resource_to_access', zh: '选择要访问的资源' },
  'terminal.footer.version': { en: 'AURA_v2.0.1', zh: 'AURA_v2.0.1' },
  'terminal.footer.status': { en: 'SYSTEM_ONLINE', zh: '系统在线' },
  'terminal.status.ready': { en: 'READY', zh: '就绪' },

  // Terminal articles
  'article.001.title': { en: 'The Algorithmic Mind', zh: '算法心智' },
  'article.002.title': { en: 'Syntax & Semantics', zh: '语法与语义' },
  'article.003.title': { en: 'Indexing Tomorrow', zh: '索引未来' },
  'article.004.title': { en: 'Human Intent Patterns', zh: '人类意图模式' },
  'article.005.title': { en: 'Zero-Click Optimization', zh: '零点击优化' },
  'article.006.title': { en: 'Entity Graph Protocol', zh: '实体图谱协议' },
  'article.007.title': { en: 'Citation Algorithm Deep Dive', zh: '引用算法深度解析' },
  'article.008.title': { en: 'Technical GEO Infrastructure', zh: 'GEO 技术基础设施' },

  // Core Thesis
  'thesis.text': { en: 'Generative Engine Optimization is the new frontier of digital presence.', zh: '生成式引擎优化是数字存在的新前沿。' },
  'thesis.label.number': { en: '02', zh: '02' },
  'thesis.label.title': { en: 'Core Thesis', zh: '核心论点' },

  // Article Index
  'index.label.number': { en: '03', zh: '03' },
  'index.label.title': { en: 'Article Index', zh: '文章索引' },
  'index.strip.01.title': { en: 'THE ALGORITHMIC MIND', zh: '算法心智' },
  'index.strip.02.title': { en: 'SYNTAX & SEMANTICS', zh: '语法与语义' },
  'index.strip.03.title': { en: 'INDEXING TOMORROW', zh: '索引未来' },
  'index.strip.04.title': { en: 'HUMAN INTENT', zh: '人类意图' },
  'index.strip.01.summary': { en: 'Understanding how generative engines process, synthesize, and present information in the age of AI-driven search.', zh: '理解在 AI 驱动搜索时代，生成式引擎如何加工、合成和呈现信息。' },
  'index.strip.02.summary': { en: 'The linguistic architecture that bridges human intent and machine comprehension in modern content systems.', zh: '现代内容系统中连接人类意图与机器理解的语言架构。' },
  'index.strip.03.summary': { en: 'How next-generation crawlers and AI agents discover, evaluate, and rank content across the digital landscape.', zh: '下一代爬虫和 AI 代理如何在数字环境中发现、评估和排名内容。' },
  'index.strip.04.summary': { en: 'Decoding the psychological patterns behind search behavior and crafting content that anticipates need.', zh: '解码搜索行为背后的心理模式，打造预判需求的内容。' },
  'index.read': { en: 'Read Article', zh: '阅读文章' },

  // Insights
  'insights.label.number': { en: '04', zh: '04' },
  'insights.label.title': { en: 'Insights Archive', zh: '洞见档案' },
  'insights.cat.all': { en: 'ALL', zh: '全部' },
  'insights.cat.geo': { en: 'GEO', zh: 'GEO' },
  'insights.cat.seo': { en: 'SEO', zh: 'SEO' },
  'insights.cat.case': { en: 'Case Studies', zh: '案例研究' },
  'insights.cat.resources': { en: 'Resources', zh: '资源' },

  // Insight articles
  'insight.1.title': { en: 'The End of Keywords: How LLMs Redefine Search Visibility', zh: '关键词的终结：LLM 如何重新定义搜索可见性' },
  'insight.1.excerpt': { en: 'Traditional keyword optimization is becoming obsolete as large language models understand context, intent, and semantic relationships at unprecedented scale.', zh: '随着大语言模型以前所未有的规模理解上下文、意图和语义关系，传统关键词优化正在过时。' },
  'insight.2.title': { en: 'Structured Data in the Age of AI Agents', zh: 'AI 代理时代的结构化数据' },
  'insight.2.excerpt': { en: 'Why schema markup remains critical even as AI systems develop their own content interpretation capabilities.', zh: '即使 AI 系统发展出自己的内容解读能力，模式标记为何仍然至关重要。' },
  'insight.3.title': { en: 'Conversational Optimization: Speaking Machine', zh: '对话式优化：与机器对话' },
  'insight.3.excerpt': { en: 'Training your content to answer questions before they are asked — the psychology of predictive information architecture.', zh: '训练你的内容在问题被提出之前作答——预测性信息架构的心理学。' },
  'insight.4.title': { en: 'The Visibility Paradox: When Being Found Means Being Forgotten', zh: '可见性悖论：当被发现意味着被遗忘' },
  'insight.4.excerpt': { en: 'An analysis of how over-optimized content can trigger algorithmic suppression in next-generation search systems.', zh: '分析过度优化的内容如何在下一代搜索系统中触发算法抑制。' },
  'insight.5.title': { en: 'Entity Graphs: Building Your Digital Genome', zh: '实体图谱：构建你的数字基因组' },
  'insight.5.excerpt': { en: 'How to construct an interconnected knowledge web that AI crawlers can traverse, understand, and amplify.', zh: '如何构建一个互联的知识网络，让 AI 爬虫能够遍历、理解和放大。' },
  'insight.6.title': { en: 'Zero-Click Optimization: Winning Without the Visit', zh: '零点击优化：无需访问即可取胜' },
  'insight.6.excerpt': { en: 'Strategies for maximizing brand presence and authority when users never leave the search results page.', zh: '当用户从不离开搜索结果页时，最大化品牌存在感和权威性的策略。' },
  'insight.7.title': { en: 'The Technical Foundations of GEO-Ready Infrastructure', zh: 'GEO 就绪基础设施的技术基础' },
  'insight.7.excerpt': { en: 'A comprehensive audit framework for ensuring your site architecture supports generative engine discovery.', zh: '一个全面的审计框架，确保你的网站架构支持生成式引擎发现。' },
  'insight.8.title': { en: 'Citation Patterns: How AI Chooses Its Sources', zh: '引用模式：AI 如何选择来源' },
  'insight.8.excerpt': { en: 'Reverse-engineering the citation algorithms of major LLMs to understand what makes content reference-worthy.', zh: '逆向工程主要 LLM 的引用算法，理解是什么让内容值得被引用。' },

  // Footer
  'footer.contact.line1': { en: 'CONTACT', zh: '联系' },
  'footer.contact.line2': { en: 'Visibility Guide', zh: 'Visibility Guide' },
  'footer.contact.byline': { en: 'by NMC Interactive', zh: 'by NMC Interactive' },
  'footer.email': { en: 'contact@nmc-interactive.com', zh: 'contact@nmc-interactive.com' },
  'footer.location': { en: 'HK, SH', zh: '香港, 上海' },
  'footer.col.platform': { en: 'Solution', zh: '解决方案' },
  'footer.col.resources': { en: 'Resources', zh: '资源' },
  'footer.col.company': { en: 'Company', zh: '公司' },
  'footer.col.legal': { en: 'Legal', zh: '法律' },
  'footer.link.geo': { en: 'GEO Analysis', zh: 'GEO 分析' },
  'footer.link.seo': { en: 'SEO Audit', zh: 'SEO 审计' },
  'footer.link.content': { en: 'Content Lab', zh: '内容实验室' },
  'footer.link.rank': { en: 'Rank Tracker', zh: '排名追踪' },
  'footer.link.docs': { en: 'Documentation', zh: '文档' },
  'footer.link.api': { en: 'API Reference', zh: 'API 参考' },
  'footer.link.cases': { en: 'Case Studies', zh: '案例研究' },
  'footer.link.blog': { en: 'Blog', zh: '博客' },
  'footer.link.about': { en: 'About', zh: '关于' },
  'footer.link.careers': { en: 'Careers', zh: '招聘' },
  'footer.link.press': { en: 'Press Kit', zh: '媒体 kit' },
  'footer.link.contact': { en: 'Contact', zh: '联系' },
  'footer.link.privacy': { en: 'Privacy Policy', zh: '隐私政策' },
  'footer.link.terms': { en: 'Terms of Service', zh: '服务条款' },
  'footer.link.cookies': { en: 'Cookie Policy', zh: 'Cookie 政策' },
  'footer.copyright': { en: '© 2026 NMC Interactive. All rights reserved.', zh: '© 2026 NMC Interactive. 保留所有权利。' },
  'footer.tag': { en: 'GEO / SEO', zh: 'GEO / SEO' },

  // Constellation
  'const.east': { en: 'EAST', zh: '东方' },
  'const.west': { en: 'WEST', zh: '西方' },
  'const.bridge': { en: 'GEO BRIDGE', zh: 'GEO 桥梁' },

  // Misc
  'lang.en': { en: 'EN', zh: 'EN' },
  'lang.zh': { en: 'ZH', zh: '中文' },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  const toggle = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'zh' : 'en'))
  }, [])

  const t = useCallback(
    (key: string): string | string[] => {
      const entry = TRANSLATIONS[key]
      if (!entry) {
        console.warn(`Missing translation: ${key}`)
        return key
      }
      return entry[lang]
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
