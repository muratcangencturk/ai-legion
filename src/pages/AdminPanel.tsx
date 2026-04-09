import { useState, useEffect } from 'react'
import axios from 'axios'

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

export default function AdminPanel({ apiUrl }: { apiUrl: string }) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stats')
  
  // Site Content State
  const [features, setFeatures] = useState<Feature[]>([])
  const [headerSettings, setHeaderSettings] = useState<HeaderFooterSettings>({
    title: '',
    description: '',
    image_url: '',
    image_size: 'medium',
    image_position: 'center'
  })
  const [footerSettings, setFooterSettings] = useState<HeaderFooterSettings>({
    title: '',
    description: '',
    image_url: '',
    image_size: 'medium',
    image_position: 'center'
  })

  // Form States
  const [newFeatureTitle, setNewFeatureTitle] = useState('')
  const [newFeatureDesc, setNewFeatureDesc] = useState('')
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsResponse = await axios.get(`${apiUrl}/api/admin/stats`)
        setStats(statsResponse.data)

        // Fetch site settings from localStorage first, then try API
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
        // Demo veri göster
        setStats({
          users_count: 1234,
          posts_count: 5678,
          articles_count: 42
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [apiUrl])

  // Save settings to localStorage and API
  const saveSettings = async () => {
    const settings = {
      features,
      header: headerSettings,
      footer: footerSettings
    }
    localStorage.setItem('siteSettings', JSON.stringify(settings))

    // Try to save to API
    try {
      await axios.put(`${apiUrl}/api/site-settings/features`, {
        value: JSON.stringify(features)
      })
      await axios.put(`${apiUrl}/api/site-settings/header`, {
        value: JSON.stringify(headerSettings)
      })
      await axios.put(`${apiUrl}/api/site-settings/footer`, {
        value: JSON.stringify(footerSettings)
      })
      alert('✅ Ayarlar kaydedildi!')
    } catch (error) {
      console.error('API kaydı başarısız, localStorage kullanılıyor:', error)
      alert('✅ Ayarlar yerel olarak kaydedildi (API bağlantısı yok)')
    }
  }

  // Add new feature
  const addFeature = () => {
    if (!newFeatureTitle.trim() || !newFeatureDesc.trim()) {
      alert('Lütfen başlık ve açıklama girin')
      return
    }
    const newFeature: Feature = {
      id: Date.now().toString(),
      title: newFeatureTitle,
      description: newFeatureDesc
    }
    setFeatures([...features, newFeature])
    setNewFeatureTitle('')
    setNewFeatureDesc('')
  }

  // Delete feature
  const deleteFeature = (id: string) => {
    if (confirm('Bu özelliği silmek istediğinizden emin misiniz?')) {
      setFeatures(features.filter(f => f.id !== id))
    }
  }

  // Update feature
  const updateFeature = (id: string, title: string, description: string) => {
    setFeatures(features.map(f => 
      f.id === id ? { ...f, title, description } : f
    ))
    setEditingFeatureId(null)
  }

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '30px' }}>⚙️ Admin Paneli</h2>

      {loading ? (
        <div className="loading">Veriler yükleniyor...</div>
      ) : !stats ? (
        <div className="error">Admin paneline erişim izniniz yok.</div>
      ) : (
        <div>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #d4af37', paddingBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('stats')}
              style={{ 
                background: activeTab === 'stats' ? '#d4af37' : 'transparent',
                color: activeTab === 'stats' ? '#0a0a0a' : '#d4af37',
                border: '1px solid #d4af37'
              }}
            >
              📊 İstatistikler
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              style={{ 
                background: activeTab === 'content' ? '#d4af37' : 'transparent',
                color: activeTab === 'content' ? '#0a0a0a' : '#d4af37',
                border: '1px solid #d4af37'
              }}
            >
              📝 Site İçeriği
            </button>
            <button 
              onClick={() => setActiveTab('header')}
              style={{ 
                background: activeTab === 'header' ? '#d4af37' : 'transparent',
                color: activeTab === 'header' ? '#0a0a0a' : '#d4af37',
                border: '1px solid #d4af37'
              }}
            >
              📌 Header
            </button>
            <button 
              onClick={() => setActiveTab('footer')}
              style={{ 
                background: activeTab === 'footer' ? '#d4af37' : 'transparent',
                color: activeTab === 'footer' ? '#0a0a0a' : '#d4af37',
                border: '1px solid #d4af37'
              }}
            >
              🔚 Footer
            </button>
          </div>

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div>
              <div className="grid" style={{ marginBottom: '30px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2em', color: '#d4af37', marginBottom: '10px' }}>👥</div>
                  <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d4af37' }}>{stats.users_count}</div>
                  <small>Toplam Kullanıcı</small>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2em', color: '#d4af37', marginBottom: '10px' }}>📝</div>
                  <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d4af37' }}>{stats.posts_count}</div>
                  <small>Toplam Post</small>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2em', color: '#d4af37', marginBottom: '10px' }}>📰</div>
                  <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d4af37' }}>{stats.articles_count}</div>
                  <small>Toplam Makale</small>
                </div>
              </div>

              <div className="card" style={{ marginTop: '30px' }}>
                <h3 style={{ color: '#d4af37' }}>🔧 Sistem Bilgisi</h3>
                <p>API URL: {apiUrl}</p>
                <p>Platform: Cloudflare Pages + Workers</p>
                <p>Database: Supabase PostgreSQL</p>
              </div>
            </div>
          )}

          {/* Site Content Tab */}
          {activeTab === 'content' && (
            <div>
              <div className="card" style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#d4af37', marginBottom: '20px' }}>✨ Özellikler Yönetimi</h3>
                
                {/* Add New Feature Form */}
                <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #d4af37' }}>
                  <h4 style={{ color: '#d4af37', marginBottom: '15px' }}>➕ Yeni Özellik Ekle</h4>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Başlık:</label>
                    <input
                      type="text"
                      value={newFeatureTitle}
                      onChange={(e) => setNewFeatureTitle(e.target.value)}
                      placeholder="Örn: Yapay Zeka Haberleri"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Açıklama:</label>
                    <textarea
                      value={newFeatureDesc}
                      onChange={(e) => setNewFeatureDesc(e.target.value)}
                      placeholder="Özelliğin açıklaması..."
                      style={{ width: '100%', minHeight: '80px' }}
                    />
                  </div>
                  <button onClick={addFeature} style={{ width: '100%' }}>➕ Özellik Ekle</button>
                </div>

                {/* Features List */}
                <h4 style={{ color: '#d4af37', marginBottom: '15px' }}>Mevcut Özellikler ({features.length})</h4>
                {features.length === 0 ? (
                  <p style={{ color: '#999' }}>Henüz özellik eklenmemiş.</p>
                ) : (
                  <div>
                    {features.map((feature) => (
                      <div key={feature.id} className="card" style={{ marginBottom: '15px', background: '#0a0a0a' }}>
                        {editingFeatureId === feature.id ? (
                          <div>
                            <input
                              type="text"
                              defaultValue={feature.title}
                              onBlur={(e) => updateFeature(feature.id, e.target.value, feature.description)}
                              style={{ width: '100%', marginBottom: '10px' }}
                            />
                            <textarea
                              defaultValue={feature.description}
                              onBlur={(e) => updateFeature(feature.id, feature.title, e.target.value)}
                              style={{ width: '100%', minHeight: '60px' }}
                            />
                            <button onClick={() => setEditingFeatureId(null)} style={{ marginTop: '10px' }}>✅ Bitti</button>
                          </div>
                        ) : (
                          <div>
                            <h5 style={{ color: '#d4af37', marginBottom: '5px' }}>{feature.title}</h5>
                            <p style={{ marginBottom: '10px' }}>{feature.description}</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button 
                                onClick={() => setEditingFeatureId(feature.id)}
                                style={{ background: '#d4af37', color: '#0a0a0a', flex: 1 }}
                              >
                                ✏️ Düzenle
                              </button>
                              <button 
                                onClick={() => deleteFeature(feature.id)}
                                style={{ background: '#c41e3a', color: '#e0d5b7', flex: 1 }}
                              >
                                🗑️ Sil
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Header Tab */}
          {activeTab === 'header' && (
            <div>
              <div className="card">
                <h3 style={{ color: '#d4af37', marginBottom: '20px' }}>📌 Header Ayarları</h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Başlık:</label>
                  <input
                    type="text"
                    value={headerSettings.title}
                    onChange={(e) => setHeaderSettings({ ...headerSettings, title: e.target.value })}
                    placeholder="Header başlığı"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Açıklama:</label>
                  <textarea
                    value={headerSettings.description}
                    onChange={(e) => setHeaderSettings({ ...headerSettings, description: e.target.value })}
                    placeholder="Header açıklaması"
                    style={{ width: '100%', minHeight: '80px' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Fotoğraf URL:</label>
                  <input
                    type="text"
                    value={headerSettings.image_url}
                    onChange={(e) => setHeaderSettings({ ...headerSettings, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Fotoğraf Boyutu:</label>
                    <select
                      value={headerSettings.image_size}
                      onChange={(e) => setHeaderSettings({ ...headerSettings, image_size: e.target.value as any })}
                      style={{ width: '100%' }}
                    >
                      <option value="small">Küçük</option>
                      <option value="medium">Orta</option>
                      <option value="large">Büyük</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Fotoğraf Pozisyonu:</label>
                    <select
                      value={headerSettings.image_position}
                      onChange={(e) => setHeaderSettings({ ...headerSettings, image_position: e.target.value as any })}
                      style={{ width: '100%' }}
                    >
                      <option value="left">Sol</option>
                      <option value="center">Orta</option>
                      <option value="right">Sağ</option>
                    </select>
                  </div>
                </div>

                <button onClick={saveSettings} style={{ width: '100%' }}>💾 Kaydet</button>
              </div>
            </div>
          )}

          {/* Footer Tab */}
          {activeTab === 'footer' && (
            <div>
              <div className="card">
                <h3 style={{ color: '#d4af37', marginBottom: '20px' }}>🔚 Footer Ayarları</h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Başlık:</label>
                  <input
                    type="text"
                    value={footerSettings.title}
                    onChange={(e) => setFooterSettings({ ...footerSettings, title: e.target.value })}
                    placeholder="Footer başlığı"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Açıklama:</label>
                  <textarea
                    value={footerSettings.description}
                    onChange={(e) => setFooterSettings({ ...footerSettings, description: e.target.value })}
                    placeholder="Footer açıklaması"
                    style={{ width: '100%', minHeight: '80px' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Fotoğraf URL:</label>
                  <input
                    type="text"
                    value={footerSettings.image_url}
                    onChange={(e) => setFooterSettings({ ...footerSettings, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Fotoğraf Boyutu:</label>
                    <select
                      value={footerSettings.image_size}
                      onChange={(e) => setFooterSettings({ ...footerSettings, image_size: e.target.value as any })}
                      style={{ width: '100%' }}
                    >
                      <option value="small">Küçük</option>
                      <option value="medium">Orta</option>
                      <option value="large">Büyük</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>Fotoğraf Pozisyonu:</label>
                    <select
                      value={footerSettings.image_position}
                      onChange={(e) => setFooterSettings({ ...footerSettings, image_position: e.target.value as any })}
                      style={{ width: '100%' }}
                    >
                      <option value="left">Sol</option>
                      <option value="center">Orta</option>
                      <option value="right">Sağ</option>
                    </select>
                  </div>
                </div>

                <button onClick={saveSettings} style={{ width: '100%' }}>💾 Kaydet</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
