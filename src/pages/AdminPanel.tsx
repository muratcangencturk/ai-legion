import { useState, useEffect } from 'react'
import axios from 'axios'

type Language = 'tr' | 'en'

interface Feature { id: string; title: string; description: string }
interface HeaderFooterSettings {
  title: string
  description: string
  image_url: string
  image_size: 'small' | 'medium' | 'large'
  image_position: 'left' | 'center' | 'right'
}

export default function AdminPanel({ apiUrl, language }: { apiUrl: string; language: Language }) {
  const tt = (tr: string, en: string) => (language === 'tr' ? tr : en)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stats')
  const [features, setFeatures] = useState<Feature[]>([])
  const [headerSettings, setHeaderSettings] = useState<HeaderFooterSettings>({ title: '', description: '', image_url: '', image_size: 'medium', image_position: 'center' })
  const [footerSettings, setFooterSettings] = useState<HeaderFooterSettings>({ title: '', description: '', image_url: '', image_size: 'medium', image_position: 'center' })
  const [newFeatureTitle, setNewFeatureTitle] = useState('')
  const [newFeatureDesc, setNewFeatureDesc] = useState('')
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get(`${apiUrl}/api/admin/stats`)
        setStats(statsResponse.data)
        const localSettings = localStorage.getItem('siteSettings')
        if (localSettings) {
          const settings = JSON.parse(localSettings)
          if (settings.features) setFeatures(settings.features)
          if (settings.header) setHeaderSettings(settings.header)
          if (settings.footer) setFooterSettings(settings.footer)
        }
        try {
          const settingsResponse = await axios.get(`${apiUrl}/api/site-settings`)
          if (settingsResponse.data.features) setFeatures(JSON.parse(settingsResponse.data.features))
          if (settingsResponse.data.header) setHeaderSettings(JSON.parse(settingsResponse.data.header))
          if (settingsResponse.data.footer) setFooterSettings(JSON.parse(settingsResponse.data.footer))
        } catch {
          console.log('Using local settings')
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setStats({ users_count: 1234, posts_count: 5678, articles_count: 42 })
      } finally { setLoading(false) }
    }
    fetchData()
  }, [apiUrl])

  const saveSettings = async () => {
    const settings = { features, header: headerSettings, footer: footerSettings }
    localStorage.setItem('siteSettings', JSON.stringify(settings))
    try {
      await axios.put(`${apiUrl}/api/site-settings/features`, { value: JSON.stringify(features) })
      await axios.put(`${apiUrl}/api/site-settings/header`, { value: JSON.stringify(headerSettings) })
      await axios.put(`${apiUrl}/api/site-settings/footer`, { value: JSON.stringify(footerSettings) })
      alert(tt('✅ Ayarlar kaydedildi!', '✅ Settings saved!'))
    } catch (error) {
      console.error('API save failed, using localStorage:', error)
      alert(tt('✅ Ayarlar yerel olarak kaydedildi (API bağlantısı yok)', '✅ Settings saved locally (no API connection)'))
    }
  }

  const addFeature = () => {
    if (!newFeatureTitle.trim() || !newFeatureDesc.trim()) return alert(tt('Lütfen başlık ve açıklama girin', 'Please enter a title and description'))
    setFeatures([...features, { id: Date.now().toString(), title: newFeatureTitle, description: newFeatureDesc }])
    setNewFeatureTitle('')
    setNewFeatureDesc('')
  }

  const deleteFeature = (id: string) => confirm(tt('Bu özelliği silmek istediğinizden emin misiniz?', 'Are you sure you want to delete this feature?')) && setFeatures(features.filter(f => f.id !== id))
  const updateFeature = (id: string, title: string, description: string) => { setFeatures(features.map(f => f.id === id ? { ...f, title, description } : f)); setEditingFeatureId(null) }

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '30px' }}>⚙️ {tt('Admin Paneli', 'Admin Panel')}</h2>
      {loading ? <div className="loading">{tt('Veriler yükleniyor...', 'Loading data...')}</div> : !stats ? <div className="error">{tt('Admin paneline erişim izniniz yok.', 'You do not have permission to access the admin panel.')}</div> : (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #d4af37', paddingBottom: '10px' }}>
            {['stats', 'content', 'header', 'footer'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? '#d4af37' : 'transparent', color: activeTab === tab ? '#0a0a0a' : '#d4af37', border: '1px solid #d4af37' }}>
                {tab === 'stats' ? `📊 ${tt('İstatistikler', 'Statistics')}` : tab === 'content' ? `📝 ${tt('Site İçeriği', 'Site Content')}` : tab === 'header' ? '📌 Header' : '🔚 Footer'}
              </button>
            ))}
          </div>

          {activeTab === 'stats' && <div><div className="grid" style={{ marginBottom: '30px' }}>
            <div className="card" style={{ textAlign: 'center' }}><div style={{ fontSize: '2em', color: '#d4af37', marginBottom: '10px' }}>👥</div><div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d4af37' }}>{stats.users_count}</div><small>{tt('Toplam Kullanıcı', 'Total Users')}</small></div>
            <div className="card" style={{ textAlign: 'center' }}><div style={{ fontSize: '2em', color: '#d4af37', marginBottom: '10px' }}>📝</div><div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d4af37' }}>{stats.posts_count}</div><small>{tt('Toplam Post', 'Total Posts')}</small></div>
            <div className="card" style={{ textAlign: 'center' }}><div style={{ fontSize: '2em', color: '#d4af37', marginBottom: '10px' }}>📰</div><div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d4af37' }}>{stats.articles_count}</div><small>{tt('Toplam Makale', 'Total Articles')}</small></div>
          </div><div className="card" style={{ marginTop: '30px' }}><h3 style={{ color: '#d4af37' }}>🔧 {tt('Sistem Bilgisi', 'System Info')}</h3><p>API URL: {apiUrl}</p><p>Platform: Cloudflare Pages + Workers</p><p>Database: Supabase PostgreSQL</p></div></div>}

          {activeTab === 'content' && <div className="card" style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#d4af37', marginBottom: '20px' }}>✨ {tt('Özellikler Yönetimi', 'Feature Management')}</h3>
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #d4af37' }}>
              <h4 style={{ color: '#d4af37', marginBottom: '15px' }}>➕ {tt('Yeni Özellik Ekle', 'Add New Feature')}</h4>
              <div style={{ marginBottom: '10px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>{tt('Başlık', 'Title')}:</label><input type="text" value={newFeatureTitle} onChange={(e) => setNewFeatureTitle(e.target.value)} placeholder={tt('Örn: Yapay Zeka Haberleri', 'e.g. AI News')} style={{ width: '100%' }} /></div>
              <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>{tt('Açıklama', 'Description')}:</label><textarea value={newFeatureDesc} onChange={(e) => setNewFeatureDesc(e.target.value)} placeholder={tt('Özelliğin açıklaması...', 'Feature description...')} style={{ width: '100%', minHeight: '80px' }} /></div>
              <button onClick={addFeature} style={{ width: '100%' }}>➕ {tt('Özellik Ekle', 'Add Feature')}</button>
            </div>
            <h4 style={{ color: '#d4af37', marginBottom: '15px' }}>{tt('Mevcut Özellikler', 'Existing Features')} ({features.length})</h4>
            {features.length === 0 ? <p style={{ color: '#999' }}>{tt('Henüz özellik eklenmemiş.', 'No features added yet.')}</p> : features.map((feature) => (
              <div key={feature.id} className="card" style={{ marginBottom: '15px', background: '#0a0a0a' }}>
                {editingFeatureId === feature.id ? <div><input type="text" defaultValue={feature.title} onBlur={(e) => updateFeature(feature.id, e.target.value, feature.description)} style={{ width: '100%', marginBottom: '10px' }} /><textarea defaultValue={feature.description} onBlur={(e) => updateFeature(feature.id, feature.title, e.target.value)} style={{ width: '100%', minHeight: '60px' }} /><button onClick={() => setEditingFeatureId(null)} style={{ marginTop: '10px' }}>✅ {tt('Bitti', 'Done')}</button></div> : <div><h5 style={{ color: '#d4af37', marginBottom: '5px' }}>{feature.title}</h5><p style={{ marginBottom: '10px' }}>{feature.description}</p><div style={{ display: 'flex', gap: '10px' }}><button onClick={() => setEditingFeatureId(feature.id)} style={{ background: '#d4af37', color: '#0a0a0a', flex: 1 }}>✏️ {tt('Düzenle', 'Edit')}</button><button onClick={() => deleteFeature(feature.id)} style={{ background: '#c41e3a', color: '#e0d5b7', flex: 1 }}>🗑️ {tt('Sil', 'Delete')}</button></div></div>}
              </div>
            ))}
          </div>}

          {(['header', 'footer'] as const).includes(activeTab as 'header' | 'footer') && (
            <div className="card">
              <h3 style={{ color: '#d4af37', marginBottom: '20px' }}>{activeTab === 'header' ? `📌 ${tt('Header Ayarları', 'Header Settings')}` : `🔚 ${tt('Footer Ayarları', 'Footer Settings')}`}</h3>
              {(() => {
                const current = activeTab === 'header' ? headerSettings : footerSettings
                const setCurrent = activeTab === 'header' ? setHeaderSettings : setFooterSettings
                return <>
                  <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>{tt('Başlık', 'Title')}:</label><input type="text" value={current.title} onChange={(e) => setCurrent({ ...current, title: e.target.value })} placeholder={tt(`${activeTab} başlığı`, `${activeTab} title`)} style={{ width: '100%' }} /></div>
                  <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>{tt('Açıklama', 'Description')}:</label><textarea value={current.description} onChange={(e) => setCurrent({ ...current, description: e.target.value })} placeholder={tt(`${activeTab} açıklaması`, `${activeTab} description`)} style={{ width: '100%', minHeight: '80px' }} /></div>
                  <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>{tt('Fotoğraf URL', 'Image URL')}:</label><input type="text" value={current.image_url} onChange={(e) => setCurrent({ ...current, image_url: e.target.value })} placeholder="https://example.com/image.jpg" style={{ width: '100%' }} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div><label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>{tt('Fotoğraf Boyutu', 'Image Size')}:</label><select value={current.image_size} onChange={(e) => setCurrent({ ...current, image_size: e.target.value as any })} style={{ width: '100%' }}><option value="small">{tt('Küçük', 'Small')}</option><option value="medium">{tt('Orta', 'Medium')}</option><option value="large">{tt('Büyük', 'Large')}</option></select></div>
                    <div><label style={{ display: 'block', marginBottom: '5px', color: '#d4af37' }}>{tt('Fotoğraf Pozisyonu', 'Image Position')}:</label><select value={current.image_position} onChange={(e) => setCurrent({ ...current, image_position: e.target.value as any })} style={{ width: '100%' }}><option value="left">{tt('Sol', 'Left')}</option><option value="center">{tt('Orta', 'Center')}</option><option value="right">{tt('Sağ', 'Right')}</option></select></div>
                  </div>
                  <button onClick={saveSettings} style={{ width: '100%' }}>💾 {tt('Kaydet', 'Save')}</button>
                </>
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
