import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Home from './pages/Home'
import Social from './pages/Social'
import Tools from './pages/Tools'
import Tutorials from './pages/Tutorials'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Arena from './pages/Arena'

const API_URL = 'https://ai-legion-api.muratcangencturk.workers.dev'

const NAV_ITEMS = [
  { key: 'home', label: '📰 Haberler' },
  { key: 'social', label: '💬 Sosyal' },
  { key: 'tools', label: '🤖 Araçlar' },
  { key: 'arena', label: '⚔️ Arena' },
  { key: 'tutorials', label: '📚 Öğretici' },
  { key: 'profile', label: '👤 Profil' },
  { key: 'admin', label: '⚙️ Admin' }
]

const pageTitles: Record<string, string> = {
  home: 'AI Legion | Güncel AI Haberleri',
  social: 'AI Legion | Sosyal Akış',
  tools: 'AI Legion | AI Araçları',
  arena: 'AI Legion | Model Arena',
  tutorials: 'AI Legion | Öğretici İçerikler',
  profile: 'AI Legion | Profil',
  admin: 'AI Legion | Admin Panel'
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState<any>(null)
  const [brandLogo, setBrandLogo] = useState('')

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`)
        console.log('✅ Workers API çalışıyor:', response.data)
      } catch (error) {
        console.error('❌ Workers API bağlantı hatası:', error)
      }
    }
    checkHealth()

    const localSettings = localStorage.getItem('siteSettings')
    if (localSettings) {
      const parsed = JSON.parse(localSettings)
      if (parsed?.header?.image_url) setBrandLogo(parsed.header.image_url)
    }
  }, [])

  useEffect(() => {
    document.title = pageTitles[currentPage] || pageTitles.home
  }, [currentPage])

  const pageContent = useMemo(() => {
    switch (currentPage) {
      case 'home':
        return <Home apiUrl={API_URL} onNavigate={setCurrentPage} />
      case 'social':
        return <Social apiUrl={API_URL} user={user} setUser={setUser} />
      case 'tools':
        return <Tools apiUrl={API_URL} />
      case 'arena':
        return <Arena />
      case 'tutorials':
        return <Tutorials />
      case 'profile':
        return <Profile apiUrl={API_URL} user={user} />
      case 'admin':
        return <AdminPanel apiUrl={API_URL} />
      default:
        return <Home apiUrl={API_URL} onNavigate={setCurrentPage} />
    }
  }, [currentPage, user])

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="top-row">
            <div className="brand-wrap">
              {brandLogo ? <img src={brandLogo} alt="AI Legion Logo" className="brand-logo" /> : <span className="logo-fallback">🏛️</span>}
              <h1 className="site-title">AI LEGION</h1>
            </div>
            {user && <span style={{ color: '#d4af37' }}>👤 {user.username}</span>}
          </div>
          <nav className="nav" aria-label="Ana navigasyon">
            {NAV_ITEMS.map(item => (
              <button key={item.key} className={`nav-link ${currentPage === item.key ? 'active' : ''}`} onClick={() => setCurrentPage(item.key)}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container page-shell" key={currentPage}>
        {pageContent}
      </main>

      <footer className="footer">
        <div className="footer-row">
          <span>AI LEGION</span>
          <a href="https://chat.whatsapp.com/LAu2OosQEmd73CBl56sIRi?mode=gi_t" target="_blank" rel="noopener noreferrer" className="wa-link">
            WhatsApp grubumuza katılın
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
