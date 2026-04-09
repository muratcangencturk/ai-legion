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

export default function Home({ apiUrl }: { apiUrl: string }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [features, setFeatures] = useState<Feature[]>([])
  const [headerSettings, setHeaderSettings] = useState<HeaderFooterSettings | null>(null)
  const [footerSettings, setFooterSettings] = useState<HeaderFooterSettings | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesResponse = await axios.get(`${apiUrl}/api/articles`)
        setArticles(articlesResponse.data)

        // Load site settings from localStorage first
        const localSettings = localStorage.getItem('siteSettings')
        if (localSettings) {
          const settings = JSON.parse(localSettings)
          if (settings.features) setFeatures(settings.features)
          if (settings.header) setHeaderSettings(settings.header)
          if (settings.footer) setFooterSettings(settings.footer)
        }

        // Try to fetch from API
        try {
          const settingsResponse = await axios.get(`${apiUrl}/api/site-settings`)
          if (settingsResponse.data.features) {
            const parsedFeatures = JSON.parse(settingsResponse.data.features)
            setFeatures(parsedFeatures)
          }
          if (settingsResponse.data.header) {
            setHeaderSettings(JSON.parse(settingsResponse.data.header))
          }
          if (settingsResponse.data.footer) {
            setFooterSettings(JSON.parse(settingsResponse.data.footer))
          }
        } catch (apiError) {
          console.log('API site-settings yüklenemedi, localStorage kullanılıyor')
        }
      } catch (error) {
        console.error('Veriler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [apiUrl])

  // Helper function to get image size class
  const getImageSizeClass = (size: string) => {
    switch (size) {
      case 'small':
        return { maxWidth: '200px', height: 'auto' }
      case 'large':
        return { maxWidth: '500px', height: 'auto' }
      default:
        return { maxWidth: '350px', height: 'auto' }
    }
  }

  // Helper function to get image position
  const getImagePositionStyle = (position: string) => {
    switch (position) {
      case 'left':
        return { float: 'left', marginRight: '20px', marginBottom: '20px' }
      case 'right':
        return { float: 'right', marginLeft: '20px', marginBottom: '20px' }
      default:
        return { display: 'block', margin: '20px auto', textAlign: 'center' as const }
    }
  }

  return (
    <div>
      {/* Custom Header Section */}
      {headerSettings && (headerSettings.title || headerSettings.description || headerSettings.image_url) && (
        <div className="hero" style={{ paddingBottom: '40px' }}>
          {headerSettings.image_url && (
            <div style={{ ...getImagePositionStyle(headerSettings.image_position), marginBottom: '20px' }}>
              <img 
                src={headerSettings.image_url} 
                alt="Header"
                style={{ ...getImageSizeClass(headerSettings.image_size), borderRadius: '8px' }}
              />
            </div>
          )}
          {headerSettings.title && (
            <h2 style={{ color: '#d4af37', marginBottom: '10px', fontSize: '2em' }}>
              {headerSettings.title}
            </h2>
          )}
          {headerSettings.description && (
            <p style={{ color: '#e0d5b7', fontSize: '1.1em', marginBottom: '10px' }}>
              {headerSettings.description}
            </p>
          )}
        </div>
      )}

      {/* Default Hero Section */}
      {!headerSettings || (!headerSettings.title && !headerSettings.description && !headerSettings.image_url) && (
        <div className="hero">
          <h1>🏛️ AI LEGION PRO</h1>
          <p>Yapay Zeka Haberleri, Araçları ve Öğretici Yazılar</p>
          <p style={{ fontSize: '0.9em', color: '#d4af37' }}>Roma Temalı Modern Platform</p>
        </div>
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <div style={{ marginTop: '40px', padding: '20px', background: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #c41e3a' }}>
          <h3 style={{ color: '#d4af37', marginBottom: '20px' }}>✨ Özellikler</h3>
          <div className="grid">
            {features.map(feature => (
              <div key={feature.id} className="card">
                <h4 style={{ color: '#d4af37' }}>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Articles Section */}
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

      {/* Featured Tools Section */}
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

      {/* Custom Footer Section */}
      {footerSettings && (footerSettings.title || footerSettings.description || footerSettings.image_url) && (
        <div style={{ marginTop: '60px', padding: '40px 20px', background: '#1a1a1a', borderRadius: '8px', borderTop: '2px solid #d4af37' }}>
          {footerSettings.image_url && (
            <div style={{ ...getImagePositionStyle(footerSettings.image_position), marginBottom: '20px' }}>
              <img 
                src={footerSettings.image_url} 
                alt="Footer"
                style={{ ...getImageSizeClass(footerSettings.image_size), borderRadius: '8px' }}
              />
            </div>
          )}
          {footerSettings.title && (
            <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
              {footerSettings.title}
            </h3>
          )}
          {footerSettings.description && (
            <p style={{ color: '#e0d5b7', marginBottom: '20px' }}>
              {footerSettings.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
