import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import ShareActions from '../components/ShareActions'
import { tutorials } from '../data/tutorials'

interface Article {
  id: string
  title: string
  content: string
  category: string
  image_url?: string
  created_at: string
}

interface Tool {
  id: string
  name: string
  category: string
  description: string
  score?: number
}

interface Post {
  id: string
  user_id: string
  content: string
  created_at: string
}

interface Feature {
  id: string
  title: string
  description: string
}

interface HeaderFooterSettings {
  title: string
  description: string
  image_url: string
  image_size: 'small' | 'medium' | 'large'
  image_position: 'left' | 'center' | 'right'
}

export default function Home({ apiUrl, onNavigate }: { apiUrl: string; onNavigate: (page: string) => void }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)
  const [features, setFeatures] = useState<Feature[]>([])
  const [headerSettings, setHeaderSettings] = useState<HeaderFooterSettings | null>(null)

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

        const localSettings = localStorage.getItem('siteSettings')
        if (localSettings) {
          const settings = JSON.parse(localSettings)
          if (settings.features) setFeatures(settings.features)
          if (settings.header) setHeaderSettings(settings.header)
        }
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [apiUrl])

  const latestArticles = useMemo(() => {
    return [...articles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [articles])

  return (
    <div>
      <div className="hero">
        <h1>{headerSettings?.title || '🏛️ AI LEGION'}</h1>
        <p>{headerSettings?.description || 'Güncel Yapay Zeka Haberleri, Araçları ve Pratik Rehberler'}</p>
        <p style={{ fontSize: '0.95em', color: '#d4af37' }}>Sürekli güncellenen içerik akışı • Keşfet • Paylaş</p>
      </div>

      {features.length > 0 && (
        <div className="section-box" style={{ marginTop: '28px' }}>
          <h3 style={{ color: '#d4af37', marginBottom: '14px' }}>✨ Platform Özellikleri</h3>
          <div className="grid">
            {features.map(feature => (
              <article key={feature.id} className="card">
                <h4 style={{ color: '#d4af37' }}>{feature.title}</h4>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      )}

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
                {article.image_url && (
                  <img src={article.image_url} alt={article.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
                )}
                <h3 style={{ color: '#d4af37' }}>{article.title}</h3>
                <span className="tool-category">{article.category}</span>
                <p style={{ marginTop: '10px' }}>{article.content}</p>
                <div className="card-footer-row">
                  <small style={{ color: '#999' }}>{new Date(article.created_at).toLocaleDateString('tr-TR')}</small>
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
                <small style={{ color: '#999' }}>{tool.score ? `Skor: ${tool.score}/10` : 'Yeni eklenen araç'}</small>
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
              <div>
                <span className="tool-category">{tutorial.category}</span>
                <span style={{ marginLeft: '8px', color: '#999' }}>⏱️ {tutorial.duration}</span>
              </div>
              <p>{tutorial.summary}</p>
              <div className="card-footer-row">
                <span />
                <ShareActions path={`/tutorials/${tutorial.slug}`} title={tutorial.title} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-box">
        <div className="section-head">
          <h3>💬 Sosyal Akıştan Son Paylaşımlar</h3>
          <button onClick={() => onNavigate('social')} className="secondary-btn">Tüm paylaşımlar</button>
        </div>
        <div>
          {posts.slice(0, 3).map(post => (
            <article key={post.id} className="post">
              <div className="post-header">
                <span>Kullanıcı #{post.user_id.slice(0, 8)}</span>
                <small>{new Date(post.created_at).toLocaleString('tr-TR')}</small>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="card-footer-row">
                <span />
                <ShareActions path={`/social/${post.id}`} title="AI Legion sosyal gönderisi" />
              </div>
            </article>
          ))}
          {posts.length === 0 && <p style={{ color: '#999' }}>Henüz sosyal içerik yok.</p>}
        </div>
      </section>
    </div>
  )
}
