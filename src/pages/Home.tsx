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
      <div className="hero">
        <h1>🏛️ AI LEGION PRO</h1>
        <p>Yapay Zeka Haberleri, Araçları ve Öğretici Yazılar</p>
        <p style={{ fontSize: '0.9em', color: '#d4af37' }}>Roma Temalı Modern Platform</p>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>📰 Son Haberler</h2>
        
        {loading ? (
          <div className="loading">Haberler yükleniyor...</div>
        ) : articles.length === 0 ? (
          <div className="card">
            <p>Henüz haber yok. Workers API'den veri çekilemiyor.</p>
            <p style={{ fontSize: '0.9em', marginTop: '10px' }}>API URL: {apiUrl}</p>
          </div>
        ) : (
          <div className="grid">
            {articles.map(article => (
              <div key={article.id} className="card">
                {article.image_url && (
                  <img src={article.image_url} alt={article.title} style={{ width: '100%', borderRadius: '4px', marginBottom: '10px' }} />
                )}
                <h3 style={{ color: '#d4af37' }}>{article.title}</h3>
                <span className="tool-category">{article.category}</span>
                <p style={{ marginTop: '10px' }}>{article.content.substring(0, 150)}...</p>
                <small style={{ color: '#999' }}>{new Date(article.created_at).toLocaleDateString('tr-TR')}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #c41e3a' }}>
        <h3 style={{ color: '#d4af37' }}>🚀 Öne Çıkan Araçlar</h3>
        <div className="grid" style={{ marginTop: '15px' }}>
          <div className="card">
            <h4 style={{ color: '#d4af37' }}>GPT-5.4</h4>
            <p>OpenAI'nin en güçlü dil modeli - 1M token context window</p>
          </div>
          <div className="card">
            <h4 style={{ color: '#d4af37' }}>Claude Opus 4.6</h4>
            <p>Anthropic'in en gelişmiş modeli - Güvenlik ve akıl yürütme</p>
          </div>
          <div className="card">
            <h4 style={{ color: '#d4af37' }}>Midjourney v7</h4>
            <p>Görüntü oluşturma - Profesyonel kalite sanat</p>
          </div>
        </div>
      </div>
    </div>
  )
}
