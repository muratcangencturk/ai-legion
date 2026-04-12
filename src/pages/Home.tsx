import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import ShareActions from '../components/ShareActions'
import DetailModal from '../components/DetailModal'
import { tutorials } from '../data/tutorials'

type Language = 'tr' | 'en'

interface Article {
  id: string
  title: string
  content: string
  category: string
  image_url?: string
  source_url?: string
  created_at: string
}

interface Tool {
  id: string
  name: string
  category: string
  description: string
  score?: number
  url?: string
  free?: boolean
}

interface Post {
  id: string
  user_id: string
  content: string
  created_at: string
}

const staleKeywords = ['3.7', 'gpt-4o', 'gemini 2.0', 'sonnet 3.7']

const curatedFallback: Record<Language, Article[]> = {
  tr: [
    { id: 'curated-1', title: 'Yeni nesil AI modellerinde uzun bağlam performansı yükseliyor', content: 'Son dönemde yayınlanan modellerde uzun doküman özetleme ve çok adımlı görev performansında gözle görülür artış var.', category: 'Model', created_at: new Date().toISOString() },
    { id: 'curated-2', title: 'AI ajanları için güvenlik denetimi standartları yaygınlaşıyor', content: 'Kurumsal ekipler, otomasyon ajanlarında izin yönetimi, kaynak doğrulama ve log izlenebilirliğine öncelik veriyor.', category: 'Güvenlik', created_at: new Date().toISOString() }
  ],
  en: [
    { id: 'curated-1', title: 'Long-context performance is improving in next-gen AI models', content: 'Recently released models show visible gains in long-document summarization and multi-step task performance.', category: 'Model', created_at: new Date().toISOString() },
    { id: 'curated-2', title: 'Security audit standards for AI agents are becoming mainstream', content: 'Enterprise teams now prioritize permission control, source verification, and log traceability in automation agents.', category: 'Security', created_at: new Date().toISOString() }
  ]
}

const text = {
  tr: { hero: 'Güncel Yapay Zeka Haberleri, Araçları ve Pratik Rehberler', latest: '📰 Son Haberler', goSocial: 'Sosyal akışa geç', loading: 'İçerikler yükleniyor...', noNews: 'Henüz haber yok. İlk içeriği admin panelinden ekleyebilirsiniz.', readNews: 'Haberi Oku', moreNews: 'Daha Fazla Haber Göster', recentTools: '🤖 Araçlardan Son Eklenenler', allTools: 'Tüm araçlar', details: 'Detaylar', featuredTutorials: '📚 Öğreticilerden Öne Çıkanlar', allTutorials: 'Tüm öğreticiler', read: 'Oku' },
  en: { hero: 'Latest AI News, Tools, and Practical Guides', latest: '📰 Latest News', goSocial: 'Go to social feed', loading: 'Loading content...', noNews: 'No news yet. You can add the first item from the admin panel.', readNews: 'Read Article', moreNews: 'Show More News', recentTools: '🤖 Recently Added Tools', allTools: 'All tools', details: 'Details', featuredTutorials: '📚 Featured Tutorials', allTutorials: 'All tutorials', read: 'Read' }
}

export default function Home({ apiUrl, onNavigate, language }: { apiUrl: string; onNavigate: (page: string) => void; language: Language }) {
  const t = text[language]
  const [articles, setArticles] = useState<Article[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)
  const [selected, setSelected] = useState<{ title: string; content: string; category?: string; sourceUrl?: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesResponse, toolsResponse, postsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/articles`),
          axios.get(`${apiUrl}/api/tools`).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}/api/posts`).catch(() => ({ data: [] }))
        ])
        setArticles(articlesResponse.data || [])
        setTools(toolsResponse.data || [])
        setPosts(postsResponse.data || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [apiUrl])

  const latestArticles = useMemo(() => {
    const sorted = [...articles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const staleRatio = sorted.length
      ? sorted.filter((a) => staleKeywords.some((kw) => `${a.title} ${a.content}`.toLowerCase().includes(kw))).length / sorted.length
      : 0

    return staleRatio > 0.4 ? curatedFallback[language] : sorted
  }, [articles, language])

  return (
    <div>
      <div className="hero"><h1>🏛️ AI LEGION</h1><p>{t.hero}</p></div>
      <section style={{ marginTop: '36px' }}>
        <div className="section-head"><h2>{t.latest}</h2><button onClick={() => onNavigate('social')} className="secondary-btn">{t.goSocial}</button></div>
        {loading ? <div className="loading">{t.loading}</div> : latestArticles.length === 0 ? <div className="card"><p>{t.noNews}</p></div> : (
          <div className="grid">{latestArticles.slice(0, visibleCount).map(article => (
            <article key={article.id} className="card clickable-card">
              {article.image_url && <img src={article.image_url} alt={article.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />}
              <h3 style={{ color: '#d4af37' }}>{article.title}</h3><span className="tool-category">{article.category}</span>
              <p style={{ marginTop: '10px' }}>{article.content.slice(0, 180)}...</p>
              <div className="card-footer-row"><button className="secondary-btn" onClick={() => setSelected({ title: article.title, content: article.content, category: article.category, sourceUrl: article.source_url })}>{t.readNews}</button><ShareActions path={`/news/${article.id}`} title={article.title} language={language} /></div>
            </article>
          ))}</div>
        )}
        {visibleCount < latestArticles.length && <div style={{ textAlign: 'center', marginTop: '10px' }}><button onClick={() => setVisibleCount(prev => prev + 6)}>{t.moreNews}</button></div>}
      </section>
      <section className="section-box">
        <div className="section-head"><h3>{t.recentTools}</h3><button onClick={() => onNavigate('tools')} className="secondary-btn">{t.allTools}</button></div>
        <div className="grid compact-grid">{tools.slice(0, 4).map(tool => (
          <article key={tool.id} className="card"><h4 style={{ color: '#d4af37' }}>{tool.name}</h4><span className="tool-category">{tool.category}</span><p>{tool.description}</p>
            <div className="card-footer-row"><button className="secondary-btn" onClick={() => setSelected({ title: tool.name, content: tool.description, category: tool.category, sourceUrl: tool.url })}>{t.details}</button><ShareActions path={`/tools/${tool.id}`} title={tool.name} language={language} /></div>
          </article>
        ))}</div>
      </section>
      <section className="section-box">
        <div className="section-head"><h3>{t.featuredTutorials}</h3><button onClick={() => onNavigate('tutorials')} className="secondary-btn">{t.allTutorials}</button></div>
        <div className="grid compact-grid">{tutorials.slice(0, 4).map(tutorial => (
          <article key={tutorial.id} className="card"><h4 style={{ color: '#d4af37' }}>{tutorial.title[language]}</h4><span className="tool-category">{tutorial.category[language]}</span><p>{tutorial.summary[language]}</p>
            <div className="card-footer-row"><button className="secondary-btn" onClick={() => setSelected({ title: tutorial.title[language], content: tutorial.summary[language], category: tutorial.category[language] })}>{t.read}</button><ShareActions path={`/tutorials/${tutorial.slug}`} title={tutorial.title[language]} language={language} /></div>
          </article>
        ))}</div>
      </section>
      {selected && <DetailModal title={selected.title} content={selected.content} category={selected.category} sourceUrl={selected.sourceUrl} onClose={() => setSelected(null)} language={language} />}
    </div>
  )
}
