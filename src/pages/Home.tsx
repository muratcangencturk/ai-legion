import { useState, useEffect } from 'react'
import axios from 'axios'

interface Article {
  id: string
  title: string
  content: string
  category: string
  image_url?: string
  created_at: string
}

const featuredCapabilities = [
  {
    title: 'Canlı AI Haber Takibi',
    description: 'Model güncellemeleri, benchmark trendleri ve sektör hareketlerini tek panelde izle.',
  },
  {
    title: 'Topluluk + Üretim Araçları',
    description: 'Sosyal akış, araç keşfi ve öğreticilerle ekip verimliliğini tek merkezde topla.',
  },
  {
    title: 'Roma İlhamlı Tasarım Dili',
    description: 'Net hiyerarşi, güçlü kontrast ve gözü yormayan koyu tema ile profesyonel deneyim.',
  },
]

export default function Home({ apiUrl }: { apiUrl: string }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/articles`)
        setArticles(response.data)
      } catch (error) {
        console.error('Haberler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [apiUrl])

  return (
    <div>
      <section className="hero">
        <p className="hero-kicker">LEGIO INTELLIGENTIA</p>
        <h2>Profesyonel AI komuta merkezi</h2>
        <p>
          Karanlık ama yumuşak tonlu, Roma estetiğiyle harmanlanmış modern bir çalışma alanı.
        </p>
      </section>

      <section className="feature-strip">
        {featuredCapabilities.map((item) => (
          <article key={item.title} className="card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="section-block">
        <div className="section-header">
          <h2>Son Haberler</h2>
          <span className="section-note">Gerçek zamanlı API akışı</span>
        </div>

        {loading ? (
          <div className="loading">Haberler yükleniyor...</div>
        ) : articles.length === 0 ? (
          <div className="card">
            <p>Henüz haber yok. API bağlantısı kontrol edilmeli.</p>
            <p className="muted-text">API URL: {apiUrl}</p>
          </div>
        ) : (
          <div className="grid">
            {articles.map((article) => (
              <article key={article.id} className="card news-card">
                {article.image_url && <img src={article.image_url} alt={article.title} className="news-image" />}
                <h3>{article.title}</h3>
                <span className="tool-category">{article.category}</span>
                <p>{article.content.substring(0, 140)}...</p>
                <small className="muted-text">{new Date(article.created_at).toLocaleDateString('tr-TR')}</small>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
