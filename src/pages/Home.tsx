import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import ShareActions from '../components/ShareActions'
import DetailModal from '../components/DetailModal'
import { tutorials } from '../data/tutorials'

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

const curatedFallback: Article[] = [
  {
    id: 'curated-1',
    title: 'Yeni nesil AI modellerinde uzun bağlam performansı yükseliyor',
    content: 'Son dönemde yayınlanan modellerde uzun doküman özetleme ve çok adımlı görev performansında gözle görülür artış var.',
    category: 'Model',
    created_at: new Date().toISOString()
  },
  {
    id: 'curated-2',
    title: 'AI ajanları için güvenlik denetimi standartları yaygınlaşıyor',
    content: 'Kurumsal ekipler, otomasyon ajanlarında izin yönetimi, kaynak doğrulama ve log izlenebilirliğine öncelik veriyor.',
    category: 'Güvenlik',
    created_at: new Date().toISOString()
  }
]

export default function Home({ apiUrl, onNavigate }: { apiUrl: string; onNavigate: (page: string) => void }) {
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
        console.error('Veriler yüklenirken hata:', error)
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

    return staleRatio > 0.4 ? curatedFallback : sorted
  }, [articles])

  return (
    <div>
      <div className="hero">
        <h1>🏛️ AI LEGION</h1>
        <p>Güncel Yapay Zeka Haberleri, Araçları ve Pratik Rehberler</p>
      </div>

      <section style={{ marginTop: '36px' }}>
        <div className="section-head">
          <h2>📰 Son Haberler</h2>
          <button onClick={() => onNavigate('social')} className="secondary-btn">Sosyal akışa geç</button>
        </div>

        {loading ? (
          <div className="loading">İçerikler yükleniyor...</div>
        ) : latestArticles.length === 0 ? (
          <div className="card">
            <p>Henüz haber yok. İlk içeriği admin panelinden ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid">
            {latestArticles.slice(0, visibleCount).map(article => (
              <article key={article.id} className="card clickable-card">
                {article.image_url && <img src={article.image_url} alt={article.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />}
                <h3 style={{ color: '#d4af37' }}>{article.title}</h3>
                <span className="tool-category">{article.category}</span>
                <p style={{ marginTop: '10px' }}>{article.content.slice(0, 180)}...</p>
                <div className="card-footer-row">
                  <button className="secondary-btn" onClick={() => setSelected({ title: article.title, content: article.content, category: article.category, sourceUrl: article.source_url })}>
                    Haberi Oku
                  </button>
                  <ShareActions path={`/news/${article.id}`} title={article.title} />
                </div>
              </article>
            ))}
          </div>
        )}

        {visibleCount < latestArticles.length && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button onClick={() => setVisibleCount(prev => prev + 6)}>Daha Fazla Haber Göster</button>
          </div>
        )}
      </section>

      <section className="section-box">
        <div className="section-head">
          <h3>🤖 Araçlardan Son Eklenenler</h3>
          <button onClick={() => onNavigate('tools')} className="secondary-btn">Tüm araçlar</button>
        </div>
        <div className="grid compact-grid">
          {tools.slice(0, 4).map(tool => (
            <article key={tool.id} className="card">
              <h4 style={{ color: '#d4af37' }}>{tool.name}</h4>
              <span className="tool-category">{tool.category}</span>
              <p>{tool.description}</p>
              <div className="card-footer-row">
                <button className="secondary-btn" onClick={() => setSelected({ title: tool.name, content: tool.description, category: tool.category, sourceUrl: tool.url })}>
                  Detaylar
                </button>
                <ShareActions path={`/tools/${tool.id}`} title={tool.name} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-box">
        <div className="section-head">
          <h3>📚 Öğreticilerden Öne Çıkanlar</h3>
          <button onClick={() => onNavigate('tutorials')} className="secondary-btn">Tüm öğreticiler</button>
        </div>
        <div className="grid compact-grid">
          {tutorials.slice(0, 4).map(tutorial => (
            <article key={tutorial.id} className="card">
              <h4 style={{ color: '#d4af37' }}>{tutorial.title}</h4>
              <span className="tool-category">{tutorial.category}</span>
              <p>{tutorial.summary}</p>
              <div className="card-footer-row">
                <button className="secondary-btn" onClick={() => setSelected({ title: tutorial.title, content: tutorial.summary, category: tutorial.category })}>
                  Oku
                </button>
                <ShareActions path={`/tutorials/${tutorial.slug}`} title={tutorial.title} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {selected && <DetailModal title={selected.title} content={selected.content} category={selected.category} sourceUrl={selected.sourceUrl} onClose={() => setSelected(null)} />}
    </div>
  )
}
